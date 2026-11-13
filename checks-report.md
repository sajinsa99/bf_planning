# Checks Report — bf_planning — 2026-11-13 16:40:14

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
| shellcheck  deploy/tune-perf.sh | ✅ PASS |
| jsonlint  package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ✅ PASS |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| htmlhint  HTML files | ✅ PASS |
| stylelint  CSS files | ✅ PASS |
| yamllint  YAML files | ✅ PASS |
| semgrep  server.js + public/app.js | ✅ PASS |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 10 · FAIL: 0 · SKIP: 2 |

---

## Shell

### `shellcheck  install.sh`

**Status:** ✅ PASS

_no output_

---

### `shellcheck  deploy/tune-perf.sh`

**Status:** ✅ PASS

_no output_

---

## JSON

### `jsonlint  package.json`

**Status:** ✅ PASS

```
{
  "name": "bf_planning",
  "version": "1.0.0",
  "description": "Duty schedule calendar for morning/evening slots",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "22.22.1",
    "npm": "9.2.0"
  },
  "dependencies": {
    "dotenv": "^18.0.10",
    "express": "^5.3.0"
  }
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ✅ PASS

```
markdownlint-cli2 v0.24.1 (markdownlint v0.42.1)
Finding: ./README.md ./plan.md ./CLAUDE.md
Linting: 3 files
Summary: 0 issues in 0 files
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## HTML

### `htmlhint  HTML files`

**Status:** ✅ PASS

```

Scanned 1 files, no errors found (19 ms).
```

---

## CSS

### `stylelint  CSS files`

**Status:** ✅ PASS

_no output_

---

## YAML

### `yamllint  YAML files`

**Status:** ✅ PASS

_no output_

---

## Static Analysis

### `semgrep  server.js + public/app.js`

**Status:** ✅ PASS

```
               
               
┌─────────────┐
│ Scan Status │
└─────────────┘
  Scanning 2 files tracked by git with 1074 Code rules:
                                                                                                                        
  Language      Rules   Files          Origin      Rules                                                                
 ─────────────────────────────        ───────────────────                                                               
  js              153       2          Community    1074                                                                
  <multilang>      47       2                                                                                           
                                                                                                                        
                
                
┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 0 (0 blocking)
 • Rules run: 200
 • Targets scanned: 2
 • Parsed lines: ~100.0%
 • No ignore information available
Ran 200 rules on 2 files: 0 findings.
(need more rules? `semgrep login` for additional free Semgrep Registry rules)

If Semgrep missed a finding, please send us feedback to let us know!
See https://semgrep.dev/docs/reporting-false-negatives/
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-11-13T15:40:05Z	INFO	[vulndb] Need to update DB
2026-11-13T15:40:05Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-13T15:40:05Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
19.19 MiB / 133.77 MiB [-------->___________________________________________________] 14.34% ? p/s ?54.30 MiB / 133.77 MiB [------------------------>___________________________________] 40.59% ? p/s ?90.06 MiB / 133.77 MiB [---------------------------------------->___________________] 67.32% ? p/s ?122.95 MiB / 133.77 MiB [----------------------------------------->___] 91.91% 172.76 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 172.76 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 172.76 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 162.78 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 162.78 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 162.78 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 152.28 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 152.28 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 152.28 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 142.45 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 142.45 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 142.45 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 133.26 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 133.26 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 133.26 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 124.66 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 124.66 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 124.66 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 116.62 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 116.62 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 116.62 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 109.10 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 109.10 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 109.10 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [-----------------------------------------------] 100.00% 25.43 MiB p/s 5.5s2026-11-13T15:40:11Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-13T15:40:11Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-13T15:40:11Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="node_modules"
2026-11-13T15:40:11Z	INFO	Number of language-specific files	num=1
2026-11-13T15:40:11Z	INFO	[npm] Detecting vulnerabilities...

Report Summary

┌───────────────────┬──────┬─────────────────┐
│      Target       │ Type │ Vulnerabilities │
├───────────────────┼──────┼─────────────────┤
│ package-lock.json │ npm  │        0        │
└───────────────────┴──────┴─────────────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)
```

---

## Secrets

### `gitleaks  secrets in repo`

**Status:** ✅ PASS

```

    ○
    │╲
    │ ○
    ○ ░
    ░    gitleaks

[90m3:40PM[0m [32mINF[0m [1m68 commits scanned.[0m
[90m3:40PM[0m [32mINF[0m [1mscanned ~172403 bytes (172.40 KB) in 249ms[0m
[90m3:40PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

