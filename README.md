# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/borcyondo-art/gta6-trophy-guide-v5/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/borcyondo-art/gta6-trophy-guide-v5/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Entry for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) — "Build the best GTA 6 trophy guide" ($250 total, top 50 paid, 1st $50).

## What it is

An offline, open-source guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden). Static files that open in a desktop browser and work with the network off.

- **Tracker** — every trophy with its official name, description and grade; a checklist saved in the browser (localStorage) with export and import; filters by kind (story, missable, collectibles, activities, robberies) and grade; search; and a spoiler setting that hides story trophies until they are earned.
- **Roadmap** — six stages to the platinum, built from the official descriptions: story first with chapter saves, the one missable trophy early, robberies, collectibles, the long grind, then cleanup and 100%.
- **Missables** — the one trophy the list can lock you out of (Positive Mental Attitude, Chapter 1), plus the time-sensitive notes.
- **Cited guides** — each trophy's guide is in our own words and names its sources. No guide text is copied from another guide.

## The trophy list

The names, descriptions and grades are the official PlayStation list, as published by:

- Exophase — GTA 6 trophy list (https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
- PSNProfiles — GTA 6 trophies (https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- Push Square — GTA 6 Trophy Guide & Roadmap (https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap)
- Output Lag — GTA 6 Trophy List (https://outputlag.com/guides/gta-6-trophy-list/)
- GamesRadar+ / PC Gamer — GTA 6 trophy list

The guides draw on those sources and cite them; they never copy their text. Five cryptic trophies (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) have no confirmed unlock method at launch, and the guide says so plainly instead of inventing one.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Everything runs from the app's own files; it makes no network request.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, the kit's copy, unchanged).

## Files

- `main.ts` — the entry program (Node 22, standard library only)
- `app/index.html` — the guide's page
- `app/css/style.css` — the paper look (coral accent, serif display)
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades and our guides
- `app/js/data.js` — loads the list, the roadmap stages and the sources
- `app/js/store.js` — saved progress (localStorage) with export and import
- `app/js/filters.js` — kind/search filters and the spoiler rule
- `app/js/views.js` — renders the checklist, roadmap, missables, sources and detail pane
- `app/js/main.js` — boots the app, routes the views, wires the controls
- `screenshots/` — 4 real renders of the guide
- `test.mjs` — the local test suite (run with `node test.mjs`)
- `shots.json` — the screenshot list

## License

MIT — see LICENSE. No Rockstar Games logo, artwork, box art or game screenshot is used anywhere in this guide. The look is our own.
