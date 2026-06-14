# Checks Report — bf_planning — 2026-06-14 11:33:05

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
| shellcheck  deploy/tune-perf.sh | ✅ PASS |
| jsonlint  package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ❌ FAIL |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  (no *.yaml / *.yml files found) | ⏭ SKIP |
| semgrep  server.js + public/app.js | ❌ FAIL |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 5 · FAIL: 2 · SKIP: 3 |

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
Summary: 19 error(s)
plan.md:5:81 MD013/line-length Line length [Expected: 80; Actual: 267]
plan.md:16 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
plan.md:38 MD032/blanks-around-lists Lists should be surrounded by blank lines [Context: "- `GET /api/schedule/:year/:mo..."]
plan.md:44 MD031/blanks-around-fences Fenced code blocks should be surrounded by blank lines [Context: "```json"]
plan.md:52:81 MD013/line-length Line length [Expected: 80; Actual: 124]
plan.md:58:81 MD013/line-length Line length [Expected: 80; Actual: 122]
plan.md:60:81 MD013/line-length Line length [Expected: 80; Actual: 161]
plan.md:63 MD032/blanks-around-lists Lists should be surrounded by blank lines [Context: "- State: `currentYear`, `curre..."]
plan.md:73:81 MD013/line-length Line length [Expected: 80; Actual: 133]
plan.md:91:81 MD013/line-length Line length [Expected: 80; Actual: 95]
plan.md:95:81 MD013/line-length Line length [Expected: 80; Actual: 104]
README.md:3:81 MD013/line-length Line length [Expected: 80; Actual: 120]
README.md:7:81 MD013/line-length Line length [Expected: 80; Actual: 91]
README.md:8:81 MD013/line-length Line length [Expected: 80; Actual: 132]
README.md:21 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
README.md:26:37 MD034/no-bare-urls Bare URL used [Context: "https://bfablet92.hd.free.fr/p..."]
README.md:32 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
README.md:39:81 MD013/line-length Line length [Expected: 80; Actual: 85]
README.md:54:81 MD013/line-length Line length [Expected: 80; Actual: 89]
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## YAML

### `yamllint  (no *.yaml / *.yml files found)`

**Status:** ⏭ SKIP

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
 • Findings: 2 (2 blocking)
 • Rules run: 200
 • Targets scanned: 2
 • Parsed lines: ~100.0%
 • No ignore information available
Ran 200 rules on 2 files: 2 findings.
                   
                   
┌─────────────────┐
│ 2 Code Findings │
└─────────────────┘
             
    server.js
     ❱ javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
          ❰❰ Blocking ❱❱
          A CSRF middleware was not detected in your express application. Ensure you are either using one such
          as `csurf` or `csrf` (see rule references) and/or you are properly doing CSRF validation in your    
          routes with a token or cookies.                                                                     
          Details: https://sg.run/BxzR                                                                        
                                                                                                              
            8┆ const app = express();
   
    ❯❱ javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
          ❰❰ Blocking ❱❱
          Detected possible user input going into a `path.join` or `path.resolve` function. This could   
          possibly lead to a path traversal vulnerability,  where the attacker can access arbitrary files
          stored in the file system. Instead, be sure to sanitize or validate user input first.          
          Details: https://sg.run/OPqk                                                                   
                                                                                                         
           24┆ return path.join(DATA_DIR, `${year}-${String(month).padStart(2, '0')}.json`);
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-06-14T09:32:59Z	INFO	[vulndb] Need to update DB
2026-06-14T09:32:59Z	INFO	[vulndb] Downloading vulnerability DB...
2026-06-14T09:32:59Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
38.05 MiB / 96.06 MiB [------------------------>____________________________________] 39.61% ? p/s ?80.44 MiB / 96.06 MiB [--------------------------------------------------->_________] 83.74% ? p/s ?96.06 MiB / 96.06 MiB [----------------------------------------------------------->] 100.00% ? p/s ?96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 96.65 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 96.65 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 96.65 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 90.41 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 90.41 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 90.41 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 84.58 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 84.58 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 84.58 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 79.12 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 79.12 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 79.12 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 74.02 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 74.02 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 74.02 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [-------------------------------------------------] 100.00% 27.70 MiB p/s 3.7s2026-06-14T09:33:03Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-06-14T09:33:03Z	INFO	[vuln] Vulnerability scanning is enabled
2026-06-14T09:33:03Z	INFO	Number of language-specific files	num=0
2026-06-14T09:33:03Z	WARN	[report] Supported files for scanner(s) not found.	scanners=[vuln]

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

[90m9:33AM[0m [32mINF[0m [1m46 commits scanned.[0m
[90m9:33AM[0m [32mINF[0m [1mscanned ~94967 bytes (94.97 KB) in 234ms[0m
[90m9:33AM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

