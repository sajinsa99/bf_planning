#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="/opt/bf_planning"
SERVICE_NAME="bf_planning"
NGINX_SNIPPET="/etc/nginx/snippets/bf_planning_location.conf"
BRUNO_CONF="/etc/nginx/sites-available/bruno"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash install.sh" >&2
  exit 1
fi

echo "==> Installing Node.js and npm..."
if ! command -v node &>/dev/null; then
  apt-get update -q
  apt-get install -y nodejs npm
else
  echo "    node $(node --version) already installed, skipping."
fi

echo "==> Copying project to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
rsync -a --exclude='.git' --exclude='node_modules' --exclude='data' --exclude='.env' \
  "$SCRIPT_DIR/" "$INSTALL_DIR/"

echo "==> Installing npm dependencies..."
cd "$INSTALL_DIR"
npm install --production --silent

echo "==> Preparing data directory..."
mkdir -p "$INSTALL_DIR/data"
chown www-data:www-data "$INSTALL_DIR/data"
chown -R www-data:www-data "$INSTALL_DIR"

echo "==> Installing systemd service..."
cp "$INSTALL_DIR/deploy/bf_planning.service" "/etc/systemd/system/${SERVICE_NAME}.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"

if [[ -f "$INSTALL_DIR/.env" ]]; then
  echo "==> Starting service..."
  systemctl restart "$SERVICE_NAME"
  systemctl status "$SERVICE_NAME" --no-pager
else
  echo ""
  echo "  ATTENTION : $INSTALL_DIR/.env est manquant."
  echo "  Créez-le avec le contenu suivant, puis lancez :"
  echo "    APP_PASSWORD=votre-mot-de-passe"
  echo "    PORT=3000"
  echo "  sudo systemctl start $SERVICE_NAME"
  echo ""
fi

echo "==> Configuring nginx..."
mkdir -p /etc/nginx/snippets
cp "$INSTALL_DIR/deploy/nginx-bf_planning.conf" "$NGINX_SNIPPET"

# Inject include into the bruno SSL server block, replacing any stale path
if [[ -f "$BRUNO_CONF" ]]; then
  if grep -q "bf_planning_location" "$BRUNO_CONF"; then
    # Replace whatever path was previously injected with the correct one
    sed -i "s|include .*/bf_planning_location.conf;|include $NGINX_SNIPPET;|" "$BRUNO_CONF"
    echo "    Updated include path in $BRUNO_CONF"
  else
    sed -i '/listen 443 ssl/a\    include /etc/nginx/snippets/bf_planning_location.conf;' "$BRUNO_CONF"
    echo "    Injected include into $BRUNO_CONF"
  fi
else
  echo "  WARNING: $BRUNO_CONF not found. Add manually to your nginx vhost:" >&2
  echo "    include $NGINX_SNIPPET;" >&2
fi

nginx -t
systemctl reload nginx

echo ""
echo "Done. Planning available at https://bfablet92.hd.free.fr/planning/"
