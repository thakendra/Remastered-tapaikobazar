# TapaikoBazar — React

The same site as the static build in the parent folder, rewritten in React with a
real router. Same stylesheet, same catalogue, same financing maths.

## Running it

```bash
npm install
npm run dev
```

`npm run build` writes to `dist/`, `npm run preview` serves that build.

## Routes

| Path | Page |
| --- | --- |
| `/` | Browse — hero, trust stats, the three sections, how to buy, testimonials, exchange and visit |
| `/two-wheelers` | The full two wheeler floor with type, brand and sort |
| `/vehicle/:id` | One vehicle: gallery, specs, price, EMI, highlights, related |
| `/finance/:id` | The three step calculator with a live summary |
| `/about` | Story, values, leadership, team, press, showroom photographs |

These are real URLs, so the back button works and a link to a vehicle can be shared.
A static host needs to send unknown paths to `index.html` or they 404 on refresh —
`vercel.json` does that here.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/catalogue.js` | The 77 vehicles, hero slides, company content, contact details |
| `src/lib/format.js` | `npr()` lakh grouping, `emi()`, price and seat labels, the price ceiling |
| `src/lib/vehicles.js` | Pre-split van/car/two wheeler lists, lookup, brand keys, seat matching |
| `src/lib/FiltersProvider.jsx` | Every filter, in one context |
| `src/lib/useMediaQuery.js` | The 980px breakpoint the sidebar and menu hang off |
| `src/components/` | Masthead, Hero, Section, Drawer, VehicleCard, Shot, Filters |
| `src/pages/` | One file per route |
| `src/styles.css` | Carried over unchanged from the static build |

## Two things worth knowing

**Filters live in one context.** Choose "Petrol" in the two wheeler section and the
browse-all button reads "Showing 12 of 47"; open `/two-wheelers` and it is already
filtered to those 47. One piece of state, two places to touch it.

**The sidebar is not a second copy of the filters.** The static build moved the live
DOM nodes between the section header and the drawer to keep their state. React does not
need that trick: `Section` renders the same components in one place or the other
depending on the breakpoint, and their state sits in context, so nothing is lost in the
move.

## Photographs

Sixteen of the 53 two wheelers have one. The rest fall back to a placeholder card
carrying the brand and model, and `Shot` catches any remote photograph that stops
resolving. To fix one, drop a file into `public/assets/` and add it as the fifth field
of its row in `TWO_WHEELER_LIST`.
