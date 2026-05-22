#!/usr/bin/env bash
set -euo pipefail

readonly BACKUP_DIR="/opt/perf-tune-backup"
readonly SYSCTL_TUNE="/etc/sysctl.d/99-perf-tune.conf"
readonly NGINX_CONF="/etc/nginx/nginx.conf"
readonly NGINX_HTTP_TUNE="/etc/nginx/conf.d/99-perf-tune.conf"
readonly SYSTEMD_DROP_IN="/etc/systemd/system/bf_planning.service.d/limits.conf"

# ---- helpers ----

die() { echo "ERROR: $*" >&2; exit 1; }

check_root() {
  [[ $EUID -eq 0 ]] || die "Run as root: sudo bash \"$0\""
}

# ---- apply ----

save_sysctl() {
  mkdir -p "$BACKUP_DIR"
  local out="$BACKUP_DIR/sysctl-before.conf"
  if [[ -f "$out" ]]; then
    echo "  sysctl snapshot already exists, keeping original -> $out"
    return
  fi
  local params=(
    net.core.somaxconn
    net.core.netdev_max_backlog
    net.ipv4.tcp_tw_reuse
    net.ipv4.tcp_fin_timeout
    net.ipv4.tcp_keepalive_time
    net.ipv4.tcp_keepalive_intvl
    net.ipv4.tcp_keepalive_probes
    net.ipv4.ip_local_port_range
    vm.dirty_ratio
    vm.dirty_background_ratio
    vm.swappiness
    fs.file-max
  )
  local p val
  for p in "${params[@]}"; do
    val=$(sysctl -n "$p" 2>/dev/null) && printf '%s = %s\n' "$p" "$val" >> "$out"
  done
  echo "  sysctl snapshot -> $out"
}

apply_sysctl() {
  cat > "$SYSCTL_TUNE" <<'EOF'
# bf_planning perf tuning -- restore: sudo bash tune-perf.sh --restore

# Increase socket listen backlog (nginx + node accept queue)
net.core.somaxconn = 1024

# Increase NIC receive queue before kernel drops packets
net.core.netdev_max_backlog = 2000

# Reuse TIME_WAIT sockets for new outgoing connections
net.ipv4.tcp_tw_reuse = 1

# Reduce FIN timeout from 60 s to 20 s
net.ipv4.tcp_fin_timeout = 20

# Reduce idle keepalive from 2 h to 5 min
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_probes = 5

# Wider ephemeral port range for outbound connections
net.ipv4.ip_local_port_range = 1024 65535

# Flush dirty pages earlier (less pressure on 1 GB RAM)
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5

# Prefer RAM over swap (no swap present; ready if one is added later)
vm.swappiness = 10

# Global open-file descriptor ceiling
fs.file-max = 65536
EOF
  sysctl -p "$SYSCTL_TUNE" > /dev/null
  echo "  Applied sysctl -> $SYSCTL_TUNE"
}

backup_nginx() {
  mkdir -p "$BACKUP_DIR"
  if [[ -f "$BACKUP_DIR/nginx.conf.bak" ]]; then
    echo "  nginx backup already exists, keeping original -> $BACKUP_DIR/nginx.conf.bak"
    return
  fi
  cp "$NGINX_CONF" "$BACKUP_DIR/nginx.conf.bak"
  echo "  nginx.conf backed up -> $BACKUP_DIR/nginx.conf.bak"
}

apply_nginx_events() {
  # Raise worker_connections from Ubuntu default (768) to 1024
  sed -i 's/worker_connections[[:space:]]\+[0-9]\+;/worker_connections 1024;/' "$NGINX_CONF"

  # Enable multi_accept: uncomment if commented out
  if grep -q '#.*multi_accept' "$NGINX_CONF"; then
    sed -i 's/#[[:space:]]*multi_accept on;/multi_accept on;/' "$NGINX_CONF"
  elif ! grep -q 'multi_accept' "$NGINX_CONF"; then
    sed -i '/worker_connections 1024;/a\    multi_accept on;' "$NGINX_CONF"
  fi

  # Add use epoll if not already present
  if ! grep -q 'use epoll' "$NGINX_CONF"; then
    sed -i '/worker_connections 1024;/a\    use epoll;' "$NGINX_CONF"
  fi

  echo "  Tuned nginx.conf events block"
}

apply_nginx_http() {
  mkdir -p "$(dirname "$NGINX_HTTP_TUNE")"
  cat > "$NGINX_HTTP_TUNE" <<'EOF'
# bf_planning perf tuning -- http-level overrides
# restore: sudo bash tune-perf.sh --restore

keepalive_timeout   30;
keepalive_requests  1000;

tcp_nopush  on;
tcp_nodelay on;

gzip            on;
gzip_comp_level 4;
gzip_types      text/plain text/css application/json application/javascript
                text/xml application/xml text/javascript;
gzip_min_length 1024;
gzip_vary       on;

open_file_cache          max=1000 inactive=20s;
open_file_cache_valid    30s;
open_file_cache_min_uses 2;
EOF
  echo "  nginx http drop-in -> $NGINX_HTTP_TUNE"
}

apply_systemd_limits() {
  local drop_in_dir
  drop_in_dir="$(dirname "$SYSTEMD_DROP_IN")"
  mkdir -p "$drop_in_dir"
  cat > "$SYSTEMD_DROP_IN" <<'EOF'
[Service]
LimitNOFILE=65536
EOF
  systemctl daemon-reload
  systemctl restart bf_planning
  echo "  systemd LimitNOFILE drop-in -> $SYSTEMD_DROP_IN"
}

apply() {
  echo "==> Saving current state..."
  save_sysctl
  backup_nginx

  echo "==> Applying sysctl..."
  apply_sysctl

  echo "==> Tuning nginx..."
  apply_nginx_events
  apply_nginx_http

  echo "==> Testing nginx config..."
  if nginx -t 2>/dev/null; then
    systemctl reload nginx
    echo "  nginx reloaded OK"
  else
    echo "ERROR: nginx -t failed -- rolling back nginx changes" >&2
    cp "$BACKUP_DIR/nginx.conf.bak" "$NGINX_CONF"
    rm -f "$NGINX_HTTP_TUNE"
    exit 1
  fi

  echo "==> Setting systemd file-descriptor limit for bf_planning..."
  apply_systemd_limits

  echo ""
  echo "Done. Backup: $BACKUP_DIR"
  echo "Restore at any time: sudo bash $0 --restore"
}

# ---- restore ----

restore() {
  [[ -d "$BACKUP_DIR" ]] || die "No backup found at $BACKUP_DIR -- run --apply first."

  echo "==> Restoring sysctl..."
  rm -f "$SYSCTL_TUNE"
  sysctl --system > /dev/null 2>&1
  echo "  Removed $SYSCTL_TUNE; reloaded all sysctl.d"

  echo "==> Restoring nginx..."
  if [[ -f "$BACKUP_DIR/nginx.conf.bak" ]]; then
    cp "$BACKUP_DIR/nginx.conf.bak" "$NGINX_CONF"
    rm -f "$NGINX_HTTP_TUNE"
    echo "  nginx.conf restored; http drop-in removed"
    if nginx -t 2>/dev/null; then
      systemctl reload nginx
      echo "  nginx reloaded OK"
    else
      echo "WARNING: restored nginx.conf fails nginx -t -- check manually" >&2
    fi
  else
    echo "  No nginx backup found, skipping"
  fi

  echo "==> Removing systemd limits drop-in..."
  if [[ -f "$SYSTEMD_DROP_IN" ]]; then
    rm -f "$SYSTEMD_DROP_IN"
    systemctl daemon-reload
    systemctl restart bf_planning
    echo "  Removed $SYSTEMD_DROP_IN"
  else
    echo "  No drop-in found, skipping"
  fi

  echo ""
  echo "Restore complete."
}

# ---- main ----

check_root

ACTION="${1:---apply}"

case "$ACTION" in
  --apply)   apply ;;
  --restore) restore ;;
  *)
    echo "Usage: $0 [--apply | --restore]"
    echo "  --apply    Save current state and apply tuning (default)"
    echo "  --restore  Restore previously saved state"
    exit 1
    ;;
esac
