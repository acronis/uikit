# @acronis-platform/design-tokens

Contains **design data only**. The colors, sizes, typography, and per-component values that define how Acronis products look, stored as plain JSON.

There are no components, no build step, and nothing to run: just the values.

The data is stored in format takes [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) (the W3C-track design-token standard) as a starting point and **builds on top of it**, adding a couple of things the standard doesn't cover yet. For more information look at [context/spec.md](./context/spec.md).

To use the stored data in this repo you need a [translation tool](https://www.designtokens.org/tr/2025.10/format/#translation-tool) that will 'translate' the design tokens in the desired format for your platform.

## Package structure

```text
design-tokens/
├── tiers/             The desing tokens captured per tier in our schema
├── schemas/           The JSON Schema of our design token tiers
├── context/           Documentation for both humans and agents
├── README.md          Introduction file
├── CONTRIBUTING.md    How to author a token, add a mode, validate.
├── LICENSE            MIT.
└── package.json       Package metadata, files, and the validate script.
```

## Getting started

|           | **Consumer** (provided solution)                                                                                                                                          | **Consumer** (DIY)                                                                                                                                                                                                                                                                                                                                         | **Contributor**                                                                                                                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Goal**  | Use the tokens for your platform (`PD` / `WEB`) in the formats we build — CSS, Tailwind.                                                                                  | Translate the tokens into your own format (CSS, iOS asset catalog, etc).                                                                                                                                                                                                                                                                                   | Create, update, and delete the tokens that consumers rely on.                                                                                                                                                                                                                                    |
| **Setup** | • `npm install @acronis-platform/tokens-pd` ([package](../tokens-pd))<br>• Import the format you want, e.g. CSS: `@import "@acronis-platform/tokens-pd/css/acronis.css";` | • Get familiar with the [glossary](./context/glossary.md), [spec](./context/spec.md), and [manifest](./context/manifest.md)<br>• Pick a [translation tool](#translation-tools)<br>• `npm install @acronis-platform/design-tokens` ([package](./package.json))<br>• Feed it to your tool, keying off [schemas/tier.schema.json](./schemas/tier.schema.json) | • Get familiar with the [glossary](./context/glossary.md), [spec](./context/spec.md), and [manifest](./context/manifest.md)<br>• Install [Node](https://nodejs.org/) 22.x<br>• Install [pnpm](https://pnpm.io/) 10.27.0<br>• Run `pnpm install`<br>• Follow [CONTRIBUTING.md](./CONTRIBUTING.md) |

## Token files

The data lives in separte .json file for each tier:

- [tiers/primitives.json](./tiers/primitives.json): units, font primatives, color palette (theme axis - light, dark)
- [tiers/semantics.json](./tiers/semantics.json): typography composites, semantic colors (brand axis - acronis, ...)
- [tiers/components.json](./tiers/components.json): per component tokens (brand axis - acronis, ...)

To undaerstand how the .json files are structured and what supports:

- [context/manifest.md](./context/manifest.md): data model, concrete token shapes, how modes resolve, and the full alias chain
- [context/spec.md](./context/spec.md): for the format rules and every key, see

Every tier .json file is validated against [schemas/tier.schema.json](./schemas/tier.schema.json).

## License

MIT for the package as a whole. See [LICENSE](./LICENSE).
