# Radhika... Will You Go On A Date With Me? 💌

A lightweight, mobile-first pixel-art date invitation. Plain HTML, CSS, and
JavaScript — no build step, no backend, no external APIs.

## Run locally

Any static file server works. From this folder:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node
npx serve .
```

Then open `http://localhost:8000` (or whatever port is printed). You can
also just double-click `index.html` to open it directly in a browser,
though a local server is recommended so relative paths behave the same
way they will in production.

## Deploy

**Vercel**
```bash
npx vercel
```
No configuration needed — it's a static site (`index.html`, `styles.css`,
`script.js`). Accept the defaults.

**Netlify**
Drag-and-drop the project folder onto the Netlify dashboard, or:
```bash
npx netlify-cli deploy --prod
```

**GitHub Pages**
Push this folder to a repo and enable Pages for the branch (Settings →
Pages → Deploy from branch → `/` root). No build step required.

## Project structure

```
index.html   – markup for all 5 stages + the note modal
styles.css   – pastel pixel-game visual style, layout, animations
script.js    – dog sprite engine, NO-button dodge logic, stage flow,
               calendar, activity picker, confirmation + note modal
assets/      – empty on purpose; all art is drawn with CSS + <canvas>,
               see "Replacing the dog / pixel art" below
```

## Where to edit things

### Text / copy
Nearly all copy lives directly in `index.html` inside each
`<section class="stage" id="stage-N">` block — headings, subheadings,
supporting text, the note content, etc. Search for the stage number's
comment banner (e.g. `STAGE 3 : PICK A DATE`) to jump to the right spot.

The "NO button" attempt messages and dog speech-bubble lines live in
`script.js` near the top of section **4. STAGE 1 — THE ASK**:

```js
const ATTEMPT_MESSAGES = [ "Really?", "Ego again?", ... ];
const BUBBLE_MESSAGES  = [ "Hmm… what are you doing?", ... ];
```

The final note text (`a_small_note.txt`) is in `index.html` inside
`#noteOverlay .note-body`.

### Date options
Stage 3 uses a real, fully-generated calendar (not a fixed list), so
there's nothing to hand-edit for available days — every date from today
onward is selectable automatically. If you want to restrict selection to
specific days (e.g. weekends only), add a check inside `renderCalendar()`
in `script.js` where `cell.classList.add("selectable")` is applied.

### Activity options
Edit the six `<button class="activity-card">` entries in `index.html`
under `STAGE 4 — ACTIVITY`. Each card needs:
```html
<button type="button" class="activity-card" data-activity="Label Shown On Confirmation">
  <span class="activity-icon" aria-hidden="true">🍽️</span>
  <span class="activity-label">DISPLAY TEXT</span>
</button>
```
Add or remove cards freely — the grid (`.activity-grid`, 3 columns) and
the selection logic in `script.js` both work with any number of cards.

### Dog / pixel art
The puppy is not an image — it's drawn on `<canvas>` from small text
grids in `script.js` (section **1. PIXEL DOG SPRITE ENGINE**):

- `DOG_HALF` — the left half of the sprite (mirrored automatically to
  produce the full symmetric puppy). Each character maps to a color in
  `PALETTE_MAIN` / `PALETTE_PARTNER` (`o` outline, `h` head/body fill,
  `e` ear fill, `w` white patch, `k` eye, `r` collar, `f` tongue).
- `TAIL_GRID` — the small tail sprite, animated separately with CSS so
  it can wag independently of the body.
- Expression variants (`blink`, `surprised`, `sideeye`, `happy`) are
  produced by swapping just the eye/mouth rows — see `gridFor()`.

To use your own pixel art instead: replace a `createDog(...)` canvas
target with an `<img>` pointing at a sprite in `assets/`, or keep the
canvas and simply feed `drawGrid()` a different grid/palette. Head-tilt,
shake, look-toward-yes, and jump reactions are plain CSS transforms on
the `.dog` wrapper (see `.dog.tilt`, `.dog.shake`, etc. in `styles.css`),
so they work with any sprite underneath.

Background scenery (clouds, hills, trees, city silhouette, sparkles,
floating hearts) is all CSS — see the `.scene-*` rules in `styles.css`.

## Notes on behavior

- The **NO** button can never actually be pressed to reject — it dodges
  on click, hover, and pointer-proximity, shrinking each time while
  **YES** grows, and is capped so it stays tappable (if oddly tiny) and
  always inside its safe zone.
- The dog has a dedicated layout area (`.dog-zone` / `.couple-zone`) on
  every stage and never shares space with text, buttons, or cards.
- Selected date and activity are held in memory (`selectedDate`,
  `selectedActivity` in `script.js`) and rendered into Stage 5's
  confirmation card — no backend, no storage, resets on page reload.
- `prefers-reduced-motion: reduce` disables decorative motion (drifting
  clouds, sparkles, floating hearts, confetti, dog idle bounce/blink)
  site-wide.
