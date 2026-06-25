## 0.36.4

### Patch Changes

- Docs: publish `ui-legacy` deprecation notice and timeline (maintenance/freeze in Jun 2026, coexistence through Q3 2026, Q4 2026 EOL window).

## [0.36.1](https://github.com/acronis/uikit/compare/v0.36.0...v0.36.1) (2026-05-18)

## 0.36.3

### Patch Changes

- [#68](https://github.com/acronis/uikit/pull/68) [`f86575a`](https://github.com/acronis/uikit/commit/f86575aec9be4738bdd4582ead37c4b7092e420e) Thanks [@leonid](https://github.com/leonid)! - Chore: bump dependencies across the monorepo and adapt source to the new
  APIs. Notable runtime bumps for the published library: `react-day-picker`
  9 → 10 (calendar), `recharts` 3.6 → 3.8 (chart), `tailwind-merge` 2 → 3,
  `zod` 4.2 → 4.4. `calendar.tsx` and `chart.tsx` were updated for the new
  `react-day-picker`/`recharts` APIs.

  The build toolchain stays on the Rollup-based Vite 6 line (Vite 8 ships
  the rolldown bundler, which miscompiles es-toolkit's CommonJS modules —
  pulled in via recharts — into a `dist` that throws at runtime in SSR
  consumers). No public API changes.

## 0.36.2

### Patch Changes

- [#53](https://github.com/acronis/uikit/pull/53) [`30e5210`](https://github.com/acronis/uikit/commit/30e521043728453a6f21355315c1ed986fcdfc86) Thanks [@heygabecom](https://github.com/heygabecom)! - Fix: `dist/components/ui/drawer.d.ts` now ships with the published
  tarball. Previously, `vite-plugin-dts` failed with TS2742 ("inferred type
  cannot be named") on six of the ten drawer exports because their types
  reach into `@radix-ui/react-dialog` (vaul's underlying primitive), which
  wasn't a declared dependency of the package — so the emitter had no
  portable specifier for the type imports.

  Adding `@radix-ui/react-dialog` as a direct dependency gives the `.d.ts`
  emitter a portable path. No source changes; the runtime tarball is
  identical. Consumers using `<Drawer />`, `<DrawerTrigger />`,
  `<DrawerContent />`, etc. now get full type information.

- [#64](https://github.com/acronis/uikit/pull/64) [`3550e41`](https://github.com/acronis/uikit/commit/3550e41cce9a8fa8097e64cd6a15622ed2ff204f) Thanks [@leonid](https://github.com/leonid)! - Internal: relocate the library to `packages/ui-legacy` as part of the monorepo
  restructure. No runtime, API, or type changes — the published tarball contents
  are identical to `0.36.1`.

- [#65](https://github.com/acronis/uikit/pull/65) [`d241835`](https://github.com/acronis/uikit/commit/d24183501f09b0506b1ebdcb671d89d88bef806e) Thanks [@leonid](https://github.com/leonid)! - Fix: `./components/*` subpath exports now ship the `types` condition
  explicitly. Under `moduleResolution: "bundler"` (and `"node16"`/`"nodenext"`),
  TypeScript previously couldn't resolve `.d.ts` files via the wildcard's
  bare-string mapping and silently fell back to the JS sibling — so deep
  imports like `@acronis-platform/shadcn-uikit/components/ui/sonner`
  appeared to consumers as "Cannot find module". The runtime resolution is
  unchanged.

### Bug Fixes

- conditionally disable Vitest addon and update TypeScript configuration ([6cc7c33](https://github.com/acronis/uikit/commit/6cc7c33a2ab2fc51ee0cf52d27c5da54e9d4424a))
- update documentation links to reflect new apps directory structure ([926c357](https://github.com/acronis/uikit/commit/926c35706cd6770bddaff4b074d05789b2be4c76))
- update import paths for storybook test utilities ([6a23a9c](https://github.com/acronis/uikit/commit/6a23a9c9b2e2e972d9754579260191d7cf6c8c82))
- update package dependencies and improve build scripts ([5290fe1](https://github.com/acronis/uikit/commit/5290fe19051a53a22fab7d6d4f3e21d3a154aa5d))
- update package versions for happy-dom, postcss, storybook, tailwindcss, and vite ([dccbe2c](https://github.com/acronis/uikit/commit/dccbe2c6f9a7d323fb0038097654e67ed8c29ba7))
- update snapshots ([c6a1700](https://github.com/acronis/uikit/commit/c6a17005b0ffb4ecf5231f6f408f156358ea05a7))

## [0.36.0](https://github.com/acronis/uikit/compare/v0.35.0...v0.36.0) (2026-05-15)

### Features

- add datatable snapshots ([40e399d](https://github.com/acronis/uikit/commit/40e399d778e22820cf1a98acd82af0cbb3e4a07e))
- add datatable snapshots 2 ([37953b8](https://github.com/acronis/uikit/commit/37953b859901f380db0942d5093cec1e0b8e9f34))
- **table:** add expandable row support to data table ([278e462](https://github.com/acronis/uikit/commit/278e4622c91c8d4390e2fc0642f76f476180dac6))

### Bug Fixes

- fix datatable tests ([cb6814c](https://github.com/acronis/uikit/commit/cb6814ccbdd747004506a5bcc3c38094aa7fe059))

## [0.35.0](https://github.com/acronis/uikit/compare/v0.34.0...v0.35.0) (2026-04-07)

### Features

- add @base-ui/react dependency and update related configurations ([01a60a7](https://github.com/acronis/uikit/commit/01a60a77b055274974c3541b9bed207597ccea21))
- add animation delay parameter to ChartContainer story ([f3809e8](https://github.com/acronis/uikit/commit/f3809e8ba9297a870237c79dfee9e221be218c60))
- add component-specific CSS variables for checkbox focus and toast shadow ([5087cb1](https://github.com/acronis/uikit/commit/5087cb14a6947a438448eec60f8369cf854e7b35))
- add field components and documentation for form layout primitives ([fbf1fb3](https://github.com/acronis/uikit/commit/fbf1fb39246671b30292a34db2041b4b45889114))
- add field snapshots ([d447de9](https://github.com/acronis/uikit/commit/d447de90a209b679905606bc25d05355e7b976a6))
- add new registries for ShadCN components, themes, and blocks with authentication parameters ([9ffc192](https://github.com/acronis/uikit/commit/9ffc192746dbf7545692d1a7531482c82ac19ca1))
- add orientation context to Resizable components for improved layout control ([2317128](https://github.com/acronis/uikit/commit/23171288c70612cfd9df86e6f225d1e9dad02671))
- add size prop to Icon and BaseIcon components for flexible sizing ([840b161](https://github.com/acronis/uikit/commit/840b161d40eac70868f1a5df9f19acc1b211cc7c))
- disable animations for chart components to improve performance ([641bec4](https://github.com/acronis/uikit/commit/641bec4c32b7305a4a8ed500ed9da134f699606e))
- docs Phase 3 — AutoTypeTable coverage for 15 more component pages ([69a9577](https://github.com/acronis/uikit/commit/69a95774c7953071cffede2f8a68376a49eb53e1))
- enhance Checkbox component styles for improved accessibility and visual feedback ([56424a4](https://github.com/acronis/uikit/commit/56424a45f87a4ba246096e0f101af978df299337))
- enhance toast notifications with additional descriptions and loading state ([9149ba5](https://github.com/acronis/uikit/commit/9149ba56d6cd17772ffc9e3dd7ee543eb9d911cf))
- optimize Dockerfile and docker-compose for improved caching and build performance ([1e3f495](https://github.com/acronis/uikit/commit/1e3f495147142b5acad65ef7480d8d46513802ca))
- optimize test runner for Sonner toasts and update Docker configurations ([1efbf54](https://github.com/acronis/uikit/commit/1efbf54980bdcb562e4dd17b2ec6ac5e93b79dc8))
- re-export UIKit Toaster and update peer dependencies for next-themes ([24081f5](https://github.com/acronis/uikit/commit/24081f543ec659f9df53aa669b25354500c0d664))
- reduce image snapshot failure threshold for improved accuracy ([3dae2b8](https://github.com/acronis/uikit/commit/3dae2b8bec7dfdb3929c7933d1453e3ed89326cb))
- simplify form field labels and improve validation schema ([f292411](https://github.com/acronis/uikit/commit/f2924113d8b87a3af6847e44916fc9618b2d2597))
- update Checkbox component styles for improved accessibility and visual consistency ([a69f187](https://github.com/acronis/uikit/commit/a69f187ef09f65f5e35c8730591b1783e3c7cc90))
- update package.json to include pnpm overrides for React dependencies and enhance storybook commands ([e1c7de7](https://github.com/acronis/uikit/commit/e1c7de77dfa8c997f1510ff310cf25815c3e75db))
- update pie chart colors to use CSS variables for consistency ([5c4b09c](https://github.com/acronis/uikit/commit/5c4b09cfb0bd84eec4e0351bda950d07791efacf))
- update TypeScript and React type definitions to latest versions ([a392626](https://github.com/acronis/uikit/commit/a392626131648396600c1e047f09601d8184af44))

### Bug Fixes

- resolve sonner dual-instance issue so toasts work in docs ([5050166](https://github.com/acronis/uikit/commit/50501669423d09fc78245e3ed2e7d0cd191c01dd))
- resolve TypeScript errors in demo and demos packages ([84251bb](https://github.com/acronis/uikit/commit/84251bbe6eb25ea08ad8835df6008c71498adc28))
- resolve TypeScript errors in UI package (stories, tests, date-picker) ([f645d48](https://github.com/acronis/uikit/commit/f645d481e3476a57865e339c1dbf625255e766b2))

## [0.34.0](https://github.com/acronis/uikit/compare/v0.33.0...v0.34.0) (2026-04-03)

### Features

- **badge:** add AI badge variants and styles ([bef1ab3](https://github.com/acronis/uikit/commit/bef1ab31e08871071108304e9f901dd0b148b19a))

### Bug Fixes

- add ai badge snapshot ([4027c4b](https://github.com/acronis/uikit/commit/4027c4bde3523d7c1145f2f7da749b5dedcbcc6a))
- **badge:** update AI badge variant key to use kebab-case ([77f12a0](https://github.com/acronis/uikit/commit/77f12a0449354762b88ab26548db4bdcd7c76dc7))
- **badge:** use CSS variable with fallback for AI gradient stop color ([79a8f96](https://github.com/acronis/uikit/commit/79a8f96b51c8ce45e2da790e8c8ddf1ee1471903))

## [0.33.0](https://github.com/acronis/uikit/compare/v0.32.4...v0.33.0) (2026-04-02)

### Features

- **ui:** migrate lucide-react from stories to internal icons ([a7935cf](https://github.com/acronis/uikit/commit/a7935cf2232774c9ec90cdeb5d9ad23893711b92))
- **ui:** migrate lucide-react to internal icons ([b3440f3](https://github.com/acronis/uikit/commit/b3440f39ca16859c478836fdfbaea9a25e58f055))

### Bug Fixes

- **empty:** set default size for empty icon component ([a8723cd](https://github.com/acronis/uikit/commit/a8723cd46b779aa78a058ac778410726f971a852))
