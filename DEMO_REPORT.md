# Source frontend rebuild status

The generic demo routes have been replaced with isolated copies of the original React frontends. This is a source port in progress, **not completed acceptance or certified visual parity**.

## Sources

- `C:/coding/EyercallALlin one/Eyerrems-desktop/frontend`
- `C:/coding/EyercallALlin one/Eyerstock`
- `C:/coding/EyercallALlin one/Eyerflow-1`
- Website: `C:/coding/EyercallALlin one/Eyercallwebsite`

The previously named `C:/coding/Eyerflow-1` also exists. Its renderer App hash matches the accessible workspace copy. Original source files were not edited; the import inventory and parity audit verify their SHA-256 hashes.

## Implemented

- Original application components, shells, routers, nested modules, CSS, tokens and frontend assets are vendored in `demo-apps/`. No runtime sibling-repository imports are used.
- Product-specific HTML documents isolate original global styles, portals and Tailwind 3 rules from the marketing site and one another.
- TanStack demo routes frame the original routers and synchronize nested paths and browser history. Existing Show Demo buttons retain their product-specific destinations.
- Browser-only fictional sessions replace original authentication. Local adapters replace Electron IPC and REMS Axios services. Network transports, mutation calls, native actions and file imports are blocked. Display preferences have separate storage namespaces.
- Original action controls remain in source. Blocked actions show `Unavailable in Read-Only Demo`. Original non-mutating controls continue to operate.
- REMS standalone spreadsheet data commands are blocked separately. Original fonts and Tabler icons are bundled locally.
- Typed Stock/Flow fixture responses cover the original IPC contracts. Core products, parties and documents have explicit fictional relationships. Further semantic validation is required for less common responses.

## Verification

- Website production build passed, including all three application bundles.
- Website and Stock/Flow strict TypeScript checks passed.
- 66 website/transport tests and two complete Stock/Flow component-tree import tests passed.
- REMS strict TypeScript reports 327 diagnostics also present in the untouched original source. Normalized comparison found zero additional diagnostics after adapter fixes. See `docs/eyerrems/typecheck.log`, `original-typecheck.log`, and `typecheck-difference.log`.
- Browser smoke checks: REMS dashboard and nine CRM tabs; Stock dashboard and original product table with search/sorting; Flow suite dashboard, WMS dashboard, wave-planning table and original history dialog. WMS nested URL, refresh and back/forward worked. Create picking wave displayed the read-only indication.
- Demo screenshots were inspected. Independent original-application screenshot baselines and matched-viewport comparisons have not been completed.

## Remaining acceptance work

- Complete and validate REMS endpoint response shapes, especially report generation, attachments and complex detail screens. Read-only report POSTs currently reject and need source-template adapters.
- Validate fictional data and all relationships for every nested Stock/Flow screen.
- Exercise every original module, tab, nested tab, detail, dialog, filter and pagination state. Current browser smoke coverage is limited.
- Launch isolated original reference frontends against safe samples and perform screenshot comparisons.
- Resolve or separately approve the inherited REMS TypeScript failures; they are not suppressed.
- Complete responsive and full marketing regression QA.

Per-component inventories and explicit pending statuses are in `docs/eyerrems/SOURCE_PARITY.md`, `docs/eyerstock/SOURCE_PARITY.md`, and `docs/eyerflow/SOURCE_PARITY.md`, with detailed JSON beside each. Source presence is not reported as functional or visual completion.
