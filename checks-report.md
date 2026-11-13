# Checks Report — bf_planning — 2026-11-13 11:50:42

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
| shellcheck  deploy/tune-perf.sh | ✅ PASS |
| jsonlint  package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ✅ PASS |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  YAML files | ✅ PASS |
| semgrep  server.js + public/app.js | ✅ PASS |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 8 · FAIL: 0 · SKIP: 2 |

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
2026-11-13T10:50:33Z	INFO	[vulndb] Need to update DB
2026-11-13T10:50:33Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-13T10:50:33Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
12.04 MiB / 133.47 MiB [----->_______________________________________________________] 9.02% ? p/s ?31.01 MiB / 133.47 MiB [------------->______________________________________________] 23.24% ? p/s ?51.64 MiB / 133.47 MiB [----------------------->____________________________________] 38.69% ? p/s ?71.95 MiB / 133.47 MiB [------------------------->_____________________] 53.91% 99.79 MiB p/s ETA 0s91.08 MiB / 133.47 MiB [-------------------------------->______________] 68.24% 99.79 MiB p/s ETA 0s110.33 MiB / 133.47 MiB [-------------------------------------->_______] 82.66% 99.79 MiB p/s ETA 0s128.48 MiB / 133.47 MiB [-------------------------------------------->_] 96.26% 99.44 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 99.44 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 99.44 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 93.56 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 93.56 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 93.56 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 87.52 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 87.52 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 87.52 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 81.88 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 81.88 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 81.88 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 76.59 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 76.59 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 76.59 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 71.65 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 71.65 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 71.65 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 67.03 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 67.03 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 67.03 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 62.71 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-------------------------------------------->] 100.00% 62.71 MiB p/s ETA 0s133.47 MiB / 133.47 MiB [-----------------------------------------------] 100.00% 23.23 MiB p/s 5.9s2026-11-13T10:50:40Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-13T10:50:40Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-13T10:50:40Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="node_modules"
2026-11-13T10:50:40Z	INFO	Number of language-specific files	num=1
2026-11-13T10:50:40Z	INFO	[npm] Detecting vulnerabilities...

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

[90m10:50AM[0m [32mINF[0m [1m63 commits scanned.[0m
[90m10:50AM[0m [32mINF[0m [1mscanned ~163030 bytes (163.03 KB) in 257ms[0m
[90m10:50AM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

