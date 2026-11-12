# Checks Report — bf_planning — 2026-11-12 16:00:01

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
    "node": "20.20.2",
    "npm": "10.8.2"
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
markdownlint-cli2 v0.24.0 (markdownlint v0.42.0)
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


A new version of Semgrep is available. See https://semgrep.dev/docs/upgrading
If Semgrep missed a finding, please send us feedback to let us know!
See https://semgrep.dev/docs/reporting-false-negatives/
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-11-12T14:59:52Z	INFO	[vulndb] Need to update DB
2026-11-12T14:59:52Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-12T14:59:52Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
18.30 MiB / 133.50 MiB [-------->___________________________________________________] 13.71% ? p/s ?42.93 MiB / 133.50 MiB [------------------->________________________________________] 32.16% ? p/s ?66.54 MiB / 133.50 MiB [----------------------------->______________________________] 49.84% ? p/s ?86.27 MiB / 133.50 MiB [----------------------------->________________] 64.62% 113.32 MiB p/s ETA 0s105.36 MiB / 133.50 MiB [----------------------------------->_________] 78.92% 113.32 MiB p/s ETA 0s126.20 MiB / 133.50 MiB [------------------------------------------>__] 94.53% 113.32 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 111.09 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 111.09 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 111.09 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 103.92 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 103.92 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 103.92 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 97.22 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 97.22 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 97.22 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 90.94 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 90.94 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 90.94 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 85.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 85.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 85.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 79.59 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 79.59 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 79.59 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 74.45 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 74.45 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 74.45 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 69.65 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-------------------------------------------->] 100.00% 69.65 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-----------------------------------------------] 100.00% 23.42 MiB p/s 5.9s2026-11-12T14:59:58Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-12T14:59:58Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-12T14:59:58Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="node_modules"
2026-11-12T14:59:58Z	INFO	Number of language-specific files	num=1
2026-11-12T14:59:58Z	INFO	[npm] Detecting vulnerabilities...

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

[90m3:00PM[0m [32mINF[0m [1m59 commits scanned.[0m
[90m3:00PM[0m [32mINF[0m [1mscanned ~158481 bytes (158.48 KB) in 294ms[0m
[90m3:00PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

