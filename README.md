# dialed.gg helper

A browser-based overlay helper for [dialed.gg](https://dialed.gg) that automatically detects the current color and shows target indicators on the HSV sliders.

## What it does

- Scans the page every 100ms to detect the active RGB color
- Converts it to HSV and places dot indicators on the H, S, V sliders showing exactly where to drag them
- Fully customizable GUI overlay with themes, colors, and sizing options

## How to use

1. Open [dialed.gg](https://dialed.gg) in your browser
2. Press **F12** to open DevTools
3. Go to the **Console** tab
4. Copy the contents of `dialed_helper.js`
5. Paste it into the console and press **Enter**
6. The overlay will appear — drag it by the left sidebar to reposition

## Controls

| Key | Action |
|-----|--------|
| `Insert` | Show / hide the overlay |
| Click logo | Collapse / expand the overlay |

## Features

- **Color Bot** — toggle the scanner and customize the target dot size and glow
- **Themes** — switch between built-in themes (Honey, Sunlight, Midnight)
- **Menu Customization** — fine-tune every color and font size in the GUI

## Themes

| Name | Accent |
|------|--------|
| Honey | `#F7C06E` |
| Sunlight | `#FD5B01` |
| Midnight | `#A36AAF` |

You can also add your own theme by editing the `THEMES` object at the top of the file — just copy an existing entry, give it a new key and name, and fill in the 8 color values.

## License

MIT — do whatever you want with it.
