---
'@acronis-platform/ui-react': minor
---

`InputTextArea`: expand into a full field and link it to Figma. It now renders the field furniture — an optional `label` (with an optional required `*`), and an optional `description` or `error` message below the textarea — mirroring `InputText`. Passing `error` switches the field to its error treatment, and the error state now paints the red `--ui-input-text-area-error-msg-box-border-color-*` border (previously only the focus ring changed). `ref` and `className` still target the underlying `<textarea>`, so the bare usage (`<InputTextArea placeholder=… />`) is unchanged. Adds the Figma Code Connect mapping (node 2797-2876).
