---
'@acronis-platform/ui-react': minor
---

**Breaking:** `Input` and `Search` are now aliases of the full field components
`InputText` and `InputSearch`. Previously they were the bare input/search boxes.

The bare boxes are now internal primitives (`InputBox` / `SearchBox`) consumed by
the field components and are no longer exported. Consumers that used `Input` /
`Search` as a plain control now get the labelled field (a wrapping element, with
optional label/clear/error furniture). To keep a bare control, compose the field
without a `label`, or migrate to `InputText` / `InputSearch` directly (same
components). `InputProps` / `SearchProps` now alias `InputTextProps` /
`InputSearchProps`.
