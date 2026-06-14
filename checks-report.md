# Checks Report — bf_planning — 2026-06-14 11:57:08

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
| shellcheck  deploy/tune-perf.sh | ✅ PASS |
| jsonlint  package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ❌ FAIL |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  YAML files | ✅ PASS |
| semgrep  server.js + public/app.js | ❌ FAIL |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 6 · FAIL: 2 · SKIP: 2 |

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
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.18.2"
  }
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ❌ FAIL (exit 1)

```
markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: ./README.md ./plan.md
Linting: 2 file(s)
Summary: 12 error(s)
plan.md:5:81 MD013/line-length Line length [Expected: 80; Actual: 267]
plan.md:54:81 MD013/line-length Line length [Expected: 80; Actual: 124]
plan.md:60:81 MD013/line-length Line length [Expected: 80; Actual: 122]
plan.md:62:81 MD013/line-length Line length [Expected: 80; Actual: 161]
plan.md:76:81 MD013/line-length Line length [Expected: 80; Actual: 133]
plan.md:94:81 MD013/line-length Line length [Expected: 80; Actual: 95]
plan.md:98:81 MD013/line-length Line length [Expected: 80; Actual: 104]
README.md:3:81 MD013/line-length Line length [Expected: 80; Actual: 120]
README.md:7:81 MD013/line-length Line length [Expected: 80; Actual: 91]
README.md:8:81 MD013/line-length Line length [Expected: 80; Actual: 132]
README.md:39:81 MD013/line-length Line length [Expected: 80; Actual: 85]
README.md:54:81 MD013/line-length Line length [Expected: 80; Actual: 89]
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## YAML

### `yamllint  YAML files`

**Status:** ✅ PASS

```
./.markdownlint-cli2.yaml
  1:1       warning  missing document start "---"  (document-start)
```

---

## Static Analysis

### `semgrep  server.js + public/app.js`

**Status:** ❌ FAIL (exit 1)

```
               
               
┌─────────────┐
│ Scan Status │
└─────────────┘
  Scanning 2 files tracked by git with 1059 Code rules:
                                                                                                                        
  Language      Rules   Files          Origin      Rules                                                                
 ─────────────────────────────        ───────────────────                                                               
  js              153       2          Community    1059                                                                
  <multilang>      47       2                                                                                           
                                                                                                                        
                
                
┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 1 (1 blocking)
 • Rules run: 200
 • Targets scanned: 2
 • Parsed lines: ~100.0%
 • No ignore information available
Ran 200 rules on 2 files: 1 finding.
                  
                  
┌────────────────┐
│ 1 Code Finding │
└────────────────┘
             
    server.js
    ❯❱ javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
          ❰❰ Blocking ❱❱
          Detected possible user input going into a `path.join` or `path.resolve` function. This could   
          possibly lead to a path traversal vulnerability,  where the attacker can access arbitrary files
          stored in the file system. Instead, be sure to sanitize or validate user input first.          
          Details: https://sg.run/OPqk                                                                   
                                                                                                         
           26┆ return path.join(DATA_DIR, `${y}-${String(m).padStart(2, '0')}.json`);
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-06-14T09:57:01Z	INFO	[vulndb] Need to update DB
2026-06-14T09:57:01Z	INFO	[vulndb] Downloading vulnerability DB...
2026-06-14T09:57:01Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
28.78 MiB / 96.06 MiB [------------------>__________________________________________] 29.96% ? p/s ?67.94 MiB / 96.06 MiB [------------------------------------------->_________________] 70.73% ? p/s ?96.06 MiB / 96.06 MiB [----------------------------------------------------------->] 100.00% ? p/s ?96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 112.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 112.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 112.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 104.87 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 104.87 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 104.87 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 98.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 98.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 98.10 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 91.77 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 91.77 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 91.77 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 85.85 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 85.85 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 85.85 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 80.31 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 80.31 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [-------------------------------------------------] 100.00% 24.51 MiB p/s 4.1s2026-06-14T09:57:06Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-06-14T09:57:06Z	INFO	[vuln] Vulnerability scanning is enabled
2026-06-14T09:57:06Z	INFO	Number of language-specific files	num=0
2026-06-14T09:57:06Z	WARN	[report] Supported files for scanner(s) not found.	scanners=[vuln]

Report Summary

┌────────┬──────┬─────────────────┐
│ Target │ Type │ Vulnerabilities │
├────────┼──────┼─────────────────┤
│   -    │  -   │        -        │
└────────┴──────┴─────────────────┘
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

[90m9:57AM[0m [32mINF[0m [1m50 commits scanned.[0m
[90m9:57AM[0m [32mINF[0m [1mscanned ~105563 bytes (105.56 KB) in 260ms[0m
[90m9:57AM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

