---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync 14 new brand themes from Figma: `blue_yellow_uss_signal`, `brown`,
`dark_gray`, `deep_purple`, `green_also_choise_df`, `ingram_micro`,
`light_blue_hp`, `orange_tsukaeru_helpox`, `pinky`, `purple`,
`purple_fusion_media`, `red_fire_brick`, `red_home_pl`, `sand`.

Populates `values.<brand>` across every semantic and component token (228
semantic + 1199 component leaves). No token paths added, removed, or changed
in value for any existing brand — purely additive. `tools/style-dictionary`'s
data-driven brand discovery picks up each new brand automatically; this
release adds the corresponding generated `tokens-pd` artifacts (`css/<brand>.css`,
`css/<Component>/<brand>.css`, `bundles/<brand>.css`,
`dtcg/{semantics,components}-<brand>.json`) for all 14.
