# Original software frontends

These are source ports, not replacement dashboards. Each app has its original component tree, routes, assets, CSS and Tailwind 3 tokens. `source-origins.json` records source paths and SHA-256 hashes. The original repositories are not deployment dependencies and have not been modified.

Run from the website:

```powershell
npm ci
npm run dev
npm run build
npm run test:demos
npm run typecheck:demos
npm run audit:demos
```

The website install also installs the locked demo dependencies. `npm run build` rebuilds all three isolated documents before the website build. During development, run `npm run build:demos` after changing a port; the website dev server serves these compiled assets. All demos use the website's TanStack routes and synchronize the original internal navigation through a validated frame message boundary.

The shared code is transport policy and framing only. UI is product-specific. `runtime.ts` blocks network transports, file imports and mutation actions, isolates display storage, and connects child navigation to parent history. `stock-flow-adapter.ts` replaces the Electron bridge. REMS's copied API boundary replaces Axios with local reads and rejecting mutations. REMS spreadsheet editing commands are blocked separately because the original spreadsheet can mutate local data without an API call.

Stock and Flow fixtures were derived from their original IPC response types, then overridden with coherent fictional products, customers, suppliers and invoices. They are not captured production data. Many less common nested fixtures still require semantic validation. REMS's local endpoint fixtures are incomplete, especially reports, attachments and complex detail screens. Do not represent this as completed parity.

## Verification status

- Website production build passed.
- 66 website/transport tests and two full renderer import tests passed.
- Website, Stock and Flow TypeScript checks passed.
- REMS strict TypeScript still fails with the same 327 diagnostics present in the untouched original source; the normalized comparison found zero additional diagnostics after adapting the API signatures. Logs are in `docs/eyerrems/`.
- Browser smoke checks covered REMS dashboard/CRM tabs, Stock dashboard, and Flow dashboard/WMS navigation. Exhaustive route, nested tab and detail coverage is pending.
- Independent original-application screenshot comparisons have not been completed. Source-preserved markup and inspected demo screenshots are not a substitute for those comparisons.

See each `docs/<product>/SOURCE_PARITY.md` and `.json` for per-component status. Source inclusion alone is not a completed functional or visual verification.
