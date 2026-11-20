# 09 · Icons

The full spec lives with the files: [`icons/README.md`](../icons/README.md). Gallery: `icons/index.html`.

In short:
- **UI icons** come from [Lucide](https://lucide.dev) (ISC licence): 24 px grid, 2 px round stroke, `currentColor`. Don't draw new UI icons; find the Lucide one.
- **Glyphs**: same grammar, used at 28 px inside a 56 px gradient `.tile`, stroked in an accent text tone (`--greenT`, `--cyanT`…).
- **Pictograms**: 120 px grid, a ghost start pose and an ink end pose, equipment and motion in one accent, knock-outs at crossings. Shown at 104 px in a `.pic` tile (green family) or `.pic.red` (red family).

Two rules:
- Every icon is `aria-hidden="true"`. The meaning belongs to the button label or the text next to it.
- Only directional icons get `data-flip-rtl`.
