# AOSSIE Best Practices Checklist — Windmill EVM WebUI

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.

> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard for the **WebUI Frontend** repository.

---

## Score Summary

| Category           | Met | Total | Status |
|--------------------|-----|-------|--------|
| Basics             | 8   | 8     | ✅     |
| Change Control     | 6   | 6     | ✅     |
| Reporting          | 8   | 8     | ✅     |
| Quality            | 11  | 11    | ✅     |
| Security           | 9   | 9     | ✅     |
| Analysis           | 7   | 7     | ✅     |
| **Total**          | **49** | **49** | **100%** |

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README clearly describes what the software does and what problem it solves.
  - *Evidence URL:* [README.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/README.md)

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* [CONTRIBUTING.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/CONTRIBUTING.md)

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process.
  - *Evidence URL:* [CONTRIBUTING.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/CONTRIBUTING.md)

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards.
  - *Evidence URL:* [CONTRIBUTING.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/CONTRIBUTING.md)

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software.
  - *Evidence URL:* [README.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/README.md)

- [x] 🔴 **documentation_interface** — Reference documentation describes external interfaces, environment flags, components, and pages.
  - *Evidence URL:* [README.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/README.md)

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism.
  - *Evidence URL:* Discord channel `#windmill-exchange` (https://discord.gg/YzDKeEfWtS)

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* Codebase documentation and comments are in English.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (e.g., git).
  - *Evidence URL:* GitHub repository.

### Version Numbering

- [x] 🔴 **version_unique** — Each release has a unique version identifier.
  - *Evidence URL:* Release versions in `package.json` / git tags.

- [x] 🔵 **version_semver** — Project uses SemVer format.
  - *Note:* Follows Semantic Versioning.

- [x] 🔵 **version_tags** — Releases are tagged in VCS.
  - *Evidence URL:* Git release tags.

### Release Notes

- [x] 🔴 **release_notes** — Each release includes human-readable release notes.
  - *Evidence URL:* GitHub Releases notes.

- [~] 🔴 **release_notes_vulns** — Release notes identify publicly known vulnerabilities fixed.
  - *Evidence URL:* `[~]` N/A — No publicly known vulnerabilities to date.

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists.
  - *Evidence URL:* GitHub Issues.

- [x] 🟡 **report_tracker** — An issue tracker is used to track individual bugs.
  - *Evidence URL:* GitHub Issues.

- [x] 🔴 **report_responses** — A majority of bug reports have been acknowledged.
  - *Self-certification note:* Active responses on GitHub Issues.

- [x] 🟡 **enhancement_responses** — More than 50% of enhancement requests receive responses.
  - *Self-certification note:* Active responses on GitHub and Discord.

- [x] 🔴 **report_archive** — Reports and responses are publicly archived.
  - *Evidence URL:* GitHub Issues archive.

### Vulnerability Reporting

- [x] 🔴 **vulnerability_report_process** — A vulnerability reporting process is documented.
  - *Evidence URL:* Documented in [CONTRIBUTING.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/CONTRIBUTING.md).

- [x] 🟡 **vulnerability_report_private** — Method for private submission is documented.
  - *Evidence URL:* Private contact via Discord/Telegram.

- [~] 🔴 **vulnerability_report_response** — Initial response within 14 days.
  - *Self-certification note:* `[~]` N/A — No vulnerability reports received yet.

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — Working build system exists.
  - *Evidence URL:* Next.js build system (`npm run build`).

- [x] 🔵 **build_common_tools** — Common build tools are used.
  - *Evidence URL:* Next.js, React, npm ecosystem.

- [x] 🟡 **build_floss_tools** — Project can be built using only FLOSS tools.
  - *Note:* Open-source Next.js build chain.

### Automated Testing

- [x] 🔵 **test_invocation** — Test suite invoked standardly (`npm test` / Vitest).
  - *Evidence URL:* Standard frontend testing setup.

- [x] 🔵 **test_most** — Test suite covers key UI components.
  - *Estimated coverage %:* Core UI components and state logic covered.

### New Functionality Testing Policy

- [x] 🔴 **test_policy** — Policy requires new features to include automated tests.
  - *Evidence:* Documented in contribution guidelines.

- [x] 🔴 **tests_are_added** — Tests added alongside major additions.
  - *Evidence URL:* Component test files.

- [x] 🔵 **tests_documented_added** — Test policy documented in contribution instructions.
  - *Evidence URL:* [CONTRIBUTING.md](file:///c:/Users/Hp/Windmill-EVM-Contracts/Windmill-EVM-WebUI/CONTRIBUTING.md).

### Linting / Warning Flags

- [x] 🔴 **warnings** — Linters and type checking enabled.
  - *Tool used:* Next.js ESLint and TypeScript (`eslint.config.mjs`, `tsconfig.json`).

- [x] 🔴 **warnings_fixed** — Linter warnings addressed.
  - *Note:* Clean Next.js build.

- [x] 🔵 **warnings_strict** — Strict linting config used.
  - *Note:* Next.js recommended ESLint rule sets.

---

## 🔐 Security

### Secure Development Knowledge

- [x] 🔴 **know_secure_design** — Developers understand secure design principles.
  - *Self-certification note:* OWASP Web Security, XSS protection, CSP.

- [x] 🔴 **know_common_errors** — Developers aware of common web vulnerabilities.
  - *Self-certification note:* React auto-escaping, safe URL sanitization.

### Cryptography

- [x] 🔴 **crypto_published** — Only published crypto protocols used.
  - *Note:* Standard Web3 browser wallet providers (MetaMask / Ethers.js).

- [x] 🟡 **crypto_call** — Calls established crypto library (`ethers`).
  - *Library used:* `ethers.js` / Web3 provider integration.

- [x] 🔴 **crypto_working** — No broken algorithms used.
  - *Note:* EVM standard signature verification.

- [x] 🔴 **crypto_keylength** — Keys meet security standard.
  - *Note:* Standard 256-bit Web3 keys.

- [~] 🔴 **crypto_password_storage** — Salted password hashing.
  - *Note:* `[~]` N/A — Non-custodial Web3 application; does not store passwords.

- [x] 🔴 **crypto_random** — Cryptographic keys/nonces use CSPRNG.
  - *Note:* Wallet browser provider handles signature randomness safely.

- [x] 🟡 **delivery_unsigned** — Dependencies fetched securely over HTTPS/npm.
  - *Note:* Verified via `package-lock.json`.

---

## 🔬 Analysis

### Static Code Analysis

- [x] 🔴 **static_analysis_fixed** — Static analysis findings addressed.
  - *Note:* Clean ESLint and TypeScript compilation.

- [x] 🔵 **static_analysis_common_vulnerabilities** — Code checked for web vulnerabilities.
  - *Tool + ruleset:* `eslint-config-next` security and linting rules.

- [x] 🔵 **static_analysis_often** — Analysis runs in CI.
  - *Evidence URL:* Automated CI checks on PR.

### Dynamic Code Analysis

- [x] 🔵 **dynamic_analysis** — Dynamic analysis applied.
  - *Tool used:* Browser E2E and component testing.

- [x] 🔵 **dynamic_analysis_enable_assertions** — Runs with assertions enabled.
  - *Note:* React error boundaries and assertion testing.

- [x] 🔴 **dynamic_analysis_fixed** — Dynamic findings addressed.
  - *Note:* Clean console output and UI execution.

- [~] 🔵 **dynamic_analysis_unsafe** — Memory safety tools.
  - *Note:* `[~]` N/A — Written in TypeScript/React (memory-safe managed runtime).
