# @acronis-platform/design-assets

Contains **design data only**. The icons and illustrations that define the Acronis visual language, stored as plain JSON manifests plus the binary files they reference.

There are no components, no build step, and nothing to run: just the data.

The manifests borrow DTCG's `$`-prefixed vocabulary but are **NOT DTCG-conformant** — project fields live at top-level keys (`values`, `platforms`, `metadata`). The `$schema` field on every file is the discriminator. For more detail see [context/spec.md](./context/spec.md).

## Package structure

```text
design-assets/
├── packs/                 One manifest per pack (.json) + bundled binaries (packs/<pack>/*).
├── rules/                 Declarative transform definitions (rules/*.json), referenced by $rules.
├── schemas/               JSON Schema (draft 2020-12) for manifests and rules.
├── context/               Documentation for both humans and agents.
├── README.md              This file — consumer-facing surface.
├── CONTRIBUTING.md        How to add an asset, pack, or rule.
├── LICENSE                MIT (package as a whole) + Lucide ISC third-party attribution.
└── package.json           Package metadata, files, and the validate script.
```

## Getting started

|           | **Consumer** (provided solution)                                                                           | **Consumer** (DIY)                                                                                                                                                                                                                                                               | **Contributor**                                                                                                                                                                                                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**  | Use Acronis icons or illustrations pre-packaged for your platform.                                         | Consume the raw manifests with a custom translation tool.                                                                                                                                                                                                                        | Add, update, or remove assets, packs, or rules.                                                                                                                                                                                                                                                       |
| **Setup** | • `npm install @acronis-platform/x` for React icons<br>• `npm install @acronis-platform/y` for SVG sprites | • Get familiar with the [glossary](./context/glossary.md), [spec](./context/spec.md), and [manifest](./context/manifest-pack.md)<br>• `npm install @acronis-platform/design-assets`<br>• Feed it to your tool, keying off [schemas/pack.schema.json](./schemas/pack.schema.json) | • Get familiar with the [glossary](./context/glossary.md), [spec](./context/spec.md), and [manifest](./context/manifest-pack.md)<br>• Install [Node](https://nodejs.org/) 22.x<br>• Install [pnpm](https://pnpm.io/) 10.27.0<br>• Run `pnpm install`<br>• Follow [CONTRIBUTING.md](./CONTRIBUTING.md) |

## Pack files

The data lives in a separate `.json` file per pack:

- [packs/icons.json](./packs/icons.json): UI icons in three groups — `solid-mono`, `solid-multi`, `stroke-mono`, `stroke-multi`
- [packs/illustrations.json](./packs/illustrations.json): marketing / illustrative artwork

To understand how pack files are structured:

- [context/manifest-pack.md](./context/manifest-pack.md): pack root + asset shape, the `values` map, derivation, metadata, platform scope
- [context/spec.md](./context/spec.md): format rules, DTCG divergence, resolution algorithm

Every pack and rule file is validated against [schemas/pack.schema.json](./schemas/pack.schema.json) and [schemas/rule.schema.json](./schemas/rule.schema.json).

## License

MIT for the package as a whole; some icons are derived from [Lucide](https://lucide.dev) (ISC), whose attribution is retained. See [LICENSE](./LICENSE) for the full text and third-party attribution.
