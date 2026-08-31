# Brand assets

| File | Use |
|---|---|
| `logo.png` | OptoLab logo lockup (eye · waveform · prism · wordmark). Navbar brand in `_quarto.yml`. Transparent background, trimmed to the artwork. |
| `favicon.png` | Browser tab icon: the eye mark from the same logo, centred on a 256×256 transparent square so it stays legible at 16 px. |
| `optical-hero.svg` | Abstract spectral illustration, used only as the Open Graph / Twitter card preview image. |

Both `logo.png` and `favicon.png` are derived from the `Logo.png` master supplied by the
laboratory. Regenerate them from that master rather than editing these files by hand, and
keep the wordmark inside `logo.png`: the navbar shows the logo alone (`title: false` in
`_quarto.yml`), so the lockup carries the laboratory name.
