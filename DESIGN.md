---
name: Юрта знаний
description: One didactic card on which a word lives in many languages — white card stock on box-frame green.
colors:
  box-green: "#247F55"
  box-green-deep: "#1B6744"
  night-green: "#0F4A30"
  mint-wash: "#E4F1E8"
  title-red: "#D0201A"
  ivory: "#F4ECDC"
  ivory-deep: "#E7DBC2"
  ink: "#16201A"
  ink-soft: "#3D4A41"
  paper: "#F3F6F1"
  card-white: "#FFFFFF"
  keyline: "#D3DED6"
  on-green-soft: "#EEF7F1"
typography:
  display:
    fontFamily: "Podkova, Rockwell, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.4rem + 5vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  card-word:
    fontFamily: "Podkova, Rockwell, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 4.6vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Podkova, Rockwell, Georgia, serif"
    fontSize: "clamp(2rem, 1.25rem + 2.7vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Podkova, Rockwell, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.2
  lead:
    fontFamily: "Golos Text, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Golos Text, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Golos Text, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.02em"
rounded:
  card: "22px"
  keyline: "14px"
  tile: "12px"
  person: "16px"
  mat: "6px"
  tab: "12px 12px 0 0"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(4.5rem, 3rem + 6vw, 8.5rem)"
  keyline-inset: "12px"
  grid-gap: "clamp(14px, 1.4vw, 22px)"
components:
  button-primary:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.5rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "#FBF6EA"
  button-ghost:
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.5rem"
    height: "52px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
  button-green:
    backgroundColor: "{colors.box-green}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
  tab-index:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.box-green-deep}"
    rounded: "{rounded.tab}"
    height: "46px"
  tab-index-active:
    backgroundColor: "{colors.box-green}"
    textColor: "{colors.card-white}"
  chip-language:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.box-green-deep}"
    rounded: "7px 7px 0 0"
    padding: "0.2rem 0.5rem"
  card-product:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.card}"
  card-contact:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
---

# Design System: Юрта знаний

## Overview

**Creative North Star: "Одно слово — семь языков"**

The whole system is the didactic card from the «Семья» set: a sheet of white card stock with a thin printed frame, one word set large in a primer slab, and index tabs along its top edge that switch the language. Every surface borrows that object. Content lives on white cards laid on a deep green field — the green of the game boxes' leafy frame — and the only tabs on the page are language or section tabs, never decoration.

The palette is a full four-role set taken from the client's own packaging and shop: box-frame green owns whole regions (hero, method, partners), box-title red sets display words on light grounds, warm ivory is reserved for the one thing a visitor should do next and for the "+ ваш язык" slot. Density is moderate: generous section spacing, compact card internals. Motion is one idea — cards are dealt into place and the language card turns — and nothing else moves.

The world rejects the default kids'-product landing: no icon-benefit grids, no cartoon confetti, no testimonial slider, no cream paper. Bashkir letters (Ә Ө Ү Ғ Ҡ Ң Ҙ Ҫ Һ) are the only ornament-scale type.

**Key Characteristics:**
- White card stock with an inset keyline on a saturated green field
- Index tabs (rounded top corners only) as the navigation and filter grammar
- Primer slab display (Podkova) over a civic text face (Golos Text); both cover Bashkir and Tatar letters
- Ivory means "act": primary buttons, the "+" language slot, the contact card
- Slight card rotation (−2.5° to 2°) for physical, hand-laid placement

## Colors

A packaging palette: one committed green field, one red for words, one warm ivory for action, on cool green-tinted neutrals.

### Primary
- **Box-Frame Green** (#247F55): full-bleed fields for the hero, method and partners sections, the header bar, active tabs, keylines (at 16–35% alpha), icons on ivory. White text on it passes 4.95:1.
- **Deep Box Green** (#1B6744): containers that sit on the green field (decision quote, offer items, team list), hover state of green buttons, text on mint chips.

### Secondary
- **Box-Title Red** (#D0201A): display words on white and paper — section headlines, the card word, the Bashkir alphabet tiles. One tone deeper than the printed box red so it passes 4.5:1 on paper.

### Tertiary
- **Warm Ivory** (#F4ECDC): primary buttons, the "+" language tab, the "Ваш язык?" contact card, the kits panel and the marten card; focus rings on green fields.
- **Ivory Shadow** (#E7DBC2): the "в работе" status chip.

### Neutral
- **Card White** (#FFFFFF): every card face, the catalogue and author sections.
- **Cool Paper** (#F3F6F1): page ground between green fields; green-tinted, never cream.
- **Mint Wash** (#E4F1E8): inactive tabs, language chips, the featured catalogue card, "в продаже" status.
- **Night Green** (#0F4A30): footer only.
- **Card Ink** (#16201A): body text and the ink button.
- **Soft Ink** (#3D4A41): secondary text on light grounds.
- **Green Mist** (#EEF7F1): secondary text on green fields (4.5:1 on Box-Frame Green).
- **Keyline Grey** (#D3DED6): hairline outlines of product and info cards.

### Named Rules
**The Ivory Means Act Rule.** Ivory appears only where the visitor can act or where a language is missing ("+ ваш язык"). Never as a background for reading content other than the kits and contact cards.

**The Field Rule.** Green is laid as whole sections, not sprinkled; a section is either green field or light ground, never a green stripe inside a light section.

## Typography

**Display Font:** Podkova (with Rockwell, Georgia, serif)
**Body Font:** Golos Text (with Segoe UI, system-ui, sans-serif)

**Character:** Podkova is a soft primer slab — the voice of a school card or a children's book cover — and carries every word that is meant to be read aloud. Golos Text is a sober civic grotesk that keeps the explanations trustworthy for officials and partners. Both are self-hosted with the cyrillic-ext subset so Bashkir and Tatar letters render in the real face.

### Hierarchy
- **Display** (800, clamp(2.75rem → 5.75rem), 0.98): the hero motto only.
- **Card word** (800, clamp(3rem → 5.75rem), 0.95, uppercase as written): the word on the language card and the "Ваш язык?" slot.
- **Headline** (800, clamp(2rem → 3.5rem), 1.04): section titles, red on light grounds, white on green.
- **Title** (700, 1.1875rem, 1.2): product names, letter senders, small section heads (Podkova).
- **Lead** (400, clamp(1.125rem → 1.3125rem), 1.55): first paragraph of a section, max 34–38em.
- **Body** (400, 1.0625rem, 1.62): running text, max ~40em.
- **Label** (700, 0.875rem, +0.02em): tabs, buttons, chips; language codes are written in their own script (Рус, Баш, Тат, Eng, Oʻzb, Қаз, Бел).

### Named Rules
**The Spoken Word Rule.** Podkova is for words a child would say out loud or a partner would quote; explanations, conditions and UI text stay in Golos Text. Prices are the exception: Podkova 800 with tabular numerals.

**The Real Letters Rule.** Never fake a Bashkir letter with a Latin look-alike (Ç for Ҫ, K for Ҡ); every face added to the system must contain ӘӨҮҒҠҢҘҪҺ and Tatar ҖҗҮө.

## Layout

A single centred column, max 1240px, with a fluid gutter (clamp(16px, 4vw, 40px)). Sections breathe with clamp(4.5rem, 3rem + 6vw, 8.5rem) vertical padding and alternate green field / light ground. Two-column splits (≈1.05 : 0.95 or 1.15 : 0.85) carry text against an object (the language card, the alphabet card, the protocol, the portrait, the contact card); they collapse to one column at 900px, and in the hero the card moves directly under the headline so it stays in the first phone viewport.

The catalogue is an auto-fill grid (min 270px, gap clamp(14px, 1.4vw, 22px), dense flow) where featured items span two columns; under 640px it becomes compact rows (104px image tile + text, description clamped to three lines). The letters gallery is three columns, two on tablets and phones. The header is a sticky green bar; under 900px its section tabs drop to a second, horizontally scrollable row with a fade at the edge.

## Elevation & Depth

Depth is physical and soft: cards are paper lying on a table, so shadows always carry a downward offset and a long blur, tinted with night green. Rotation (−2.5° to 2°) does as much depth work as shadow. Flat outlines (keyline grey) are used for catalogue cards at rest; shadow arrives on hover.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px rgba(7,63,34,.08), 0 18px 40px -18px rgba(7,63,34,.35)`): alphabet card, letters, hover state of product cards.
- **Card lifted** (`box-shadow: 0 2px 4px rgba(7,63,34,.10), 0 28px 48px -20px rgba(7,63,34,.45)`): the language card, the protocol document, the portrait, the contact card, letters on hover.

### Named Rules
**The Paper Rule.** Every shadow has a y-offset and blur; zero-offset glows and hard offset blocks do not exist in this world.

## Shapes

Cards have 22px corners and an inset keyline 12px inside (1.5px, box green at 30–35% alpha, 14px radius) — the printed frame of a didactic card; catalogue cards use a fainter 7px-inset keyline. Tabs have rounded top corners only (12px 12px 0 0) and sit on a 3px green baseline when grouped. Buttons are full pills. Square tiles (12–14px radius) hold single letters and product thumbnails on phones. Scanned documents keep a 9–10px white mat with nearly square corners.

## Components

### Buttons
- **Shape:** full pill (999px), min height 52px (42px small).
- **Primary:** Warm Ivory with ink text, soft dark drop shadow; hover lifts 2px and lightens to #FBF6EA.
- **Ghost:** on green fields only — white text with a 2px inset white ring at 55%, solid white ring on hover.
- **Ink / Green:** ink button inside ivory cards; green button inside the ivory kits panel.
- **Focus:** 3px ink outline at 3px offset on light grounds, ivory on green fields, ink again on ivory surfaces.

### Index tabs (signature grammar)
- **Style:** Golos Text 700 label, rounded top corners, 40–46px tall.
- **On green:** inactive white at 16% alpha with white text; active is card white with green text and visually attaches to the card or page below.
- **On light ground:** inactive mint wash with deep green text; active box green with white text; counts in tabular numerals at 70% opacity.
- **Behaviour:** language tabs follow the ARIA tabs pattern (arrow keys, Home/End); filter tabs are toggle buttons with aria-pressed.

### Language card (signature component)
White card on a slight −2.5° tilt with two ghost cards behind it, keyline frame, tabs along the top edge, the word in red Podkova, the language's own name plus a status chip ("в продаже" mint, "в работе" ivory), the logo children and yurt at the foot. It cycles languages every 2.4s while visible, pauses on hover/focus, stops for good after the first click, and turns with one 3D flip (160ms out, 460ms ease-out in). The final "+" tab turns the card ivory with a dashed keyline: "Ваш язык?".

### Chips
- **Language chips:** tiny index tabs (7px top radius) in mint wash with a 2px green baseline, one per language a product actually supports.
- **Year / status chips:** pills in mint wash or ivory shadow, 0.75–0.8125rem bold.

### Cards / Containers
- **Product card:** white, 22px radius, hairline keyline-grey outline plus faint inner keyline, 4:3 image well with the box shot contained, Podkova title, chips, two-line description, price + "Купить ↗" pill pinned to the bottom. Hover: lift 3px and card-rest shadow.
- **Featured product:** spans two columns, mint wash ground, red title.
- **Contact card:** ivory, dashed ink keyline, 1.5° tilt, Podkova "Ваш язык?" headline, ink WhatsApp button, icon list.
- **Marten card:** ivory card on the method section's green field, 2° tilt, inset keyline, the marten illustration, the protocol's title and an ink pill that opens the document.
- **Containers on green:** deep box green, 12–22px radius, no outline.

### Carousels
- **Structure:** Podkova title and round prev/next buttons (44px, white with a hairline, green on hover, 40% opacity when disabled) above a horizontal scroll-snap track; the next slide always peeks past the edge so the row reads as scrollable. Native swipe and keyboard scrolling work; the buttons hide when nothing overflows.
- **Documents:** two carousels side by side, each slide 44% of its column (66% on phones), so both fit one screen. Scans sit on a white mat with a card-rest shadow, no rotation; sender, reason and a year chip below.
- **Team:** one strip of 172px person cards (142px on phones).

### Person cards (team switcher)
White card, 16px radius, hairline outline, 4:5 photo well, Podkova name, role clamped to four lines; the active card carries a 2px green ring. Without a photo the well shows the person's initials in Podkova on mint wash. Clicking a card turns the large author photo with the same flip as the language card and swaps the heading, role and description; Elena's card restores her story. On phones the strip sits above the large card, so the change stays in view.

### Navigation
Sticky green header: the client logo (children and yurt) at 60px, wordmark in Podkova capitals with the Bashkir name beneath in the same face, section tabs on the right edge (active tab in paper colour, set by scroll position), ivory "Написать Елене" pill. On phones the CTA collapses to an icon circle with a hidden label and the tabs become a scrollable second row.

### Document viewer
Native `<dialog>` with a night-green blurred backdrop, the scan on white, caption beneath, round translucent prev/next/close buttons; arrow keys page within the same carousel, and a document opened on its own shows no paging.

## Do's and Don'ts

### Do:
- **Do** lay green as whole sections (#247F55) and put white cards on it.
- **Do** keep every card's inset keyline (12px in, 1.5px, green at ~30% alpha) — it is what makes a rectangle a didactic card.
- **Do** write language codes and words in their own script, with `lang` attributes (ru, ba, tt, en, uz, kk, be).
- **Do** use ivory (#F4ECDC) for the next action and for missing-language slots only.
- **Do** keep motion to the deal (rise + slight rotation settle, 0.8s exponential ease-out) and the card flip; honour prefers-reduced-motion by removing both.

### Don't:
- **Don't** use cream or parchment grounds; light grounds are white or cool paper (#F3F6F1).
- **Don't** build icon-plus-heading benefit grids, testimonial sliders or eyebrow labels above headings.
- **Don't** set display type in a face that lacks Bashkir letters; check ӘӨҮҒҠҢҘҪҺ before adopting any font.
- **Don't** use zero-offset glows or hard offset shadows.
- **Don't** invent claims, reviews or numbers; every fact on the page comes from the project's own documents.
