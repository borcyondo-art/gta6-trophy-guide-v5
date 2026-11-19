# Leonida Legend — build report (v5)

GTA 6 trophy guide & tracker for make.fun bounty gta6-trophy-guide-01.
Built from scratch in this repository, in a single recorded session.

## What was built

- `main.ts` (34 lines) — the entry program, written from the prose spec: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored library. Never read any other main.ts.
- `app/data/trophies.json` (28,921 bytes) — all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden), each with its official name, description, grade, kind, missable flag, PSN target where known, a guide in our own words, and cited sources. Typed in 4 chunks and revised afterwards.
- `app/index.html` (85 lines), `app/css/style.css` (301 lines) — the paper look: coral accent, serif display, medal swatches.
- `app/js/data.js` (112), `app/js/store.js` (64), `app/js/filters.js` (55), `app/js/views.js` (168), `app/js/main.js` (141) — data + roadmap stages, localStorage progress with export/import, kind/search filters and the spoiler rule, the five views, boot/routing/keys.
- `test.mjs` (229 lines) — 656 checks, all passing (see below).
- `screenshots/` — 4 real renders of the guide in headless Chromium (1280x800 JPEG, 13 of 55 earned seeded): checklist cover, roadmap, missables, trophy detail.
- `README.md` (63 lines, with the 3 make.fun badge lines + bounty link), `LICENSE` (MIT, SPDX line first), `shots.json`, `serve.ts` + `vendor/makefun-frontend.ts` (kit files, copied unchanged).

## Verification

- `node test.mjs`: **656 passed, 0 failed, 656 checks** — trophy data (counts, tiers, unique names, guides present, sources cited, official names), app files and references (no http(s) URL under `app/`), JS parses, entry program, README badges, LICENSE, screenshots (size and dimensions), dossier run.
- Grader-style run (`MAKEFUN_OUTPUT_DIR=out node main.ts`): writes `out/dossier.json` (schema makefun/dossier/v1, 4 images, text within the 163,840-byte cap).
- Kit check (`makefun check`): run before the build commit; the only failures were the uncommitted tree (license/entrypoint read the committed snapshot) and the anchor signature (see below). Re-run after the commit.
- Screenshots viewed by the builder: cover, roadmap, missables and detail are all clean and readable. One fix made after viewing: the detail pane showed the Sources line twice; the duplicate was removed from `views.js` and the detail screenshot retaken.

## How the trophy list was sourced

The official names, descriptions and grades come from the public lists as reported on 2026-11-18/19: Output Lag's GTA 6 Trophy List (which states its descriptions are the official text), cross-checked against Push Square's Trophy Guide & Roadmap, GamesRadar+/PC Gamer via gtasix.how, and the Exophase/PSNProfiles lists they cite. The guides are written in our own words from those facts and cite their sources per trophy. The kit starter's `trophies.json` was never read.

## Honest weaknesses

- The names and descriptions are taken from the public lists, not from PlayStation directly. If any name differs from the sealed reference list, the trophies gate fails that trophy. The two lists used agree on every name, description and grade, and the "T**s Ass Drug Money" spelling matches the published list.
- Five cryptic trophies (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) have no confirmed unlock method at launch. The guide says so plainly instead of inventing one.
- No one on this build has played the game (it is a day old). Unlock methods come from published guides, cited per trophy, and are written in our own words — not copied.
- Only one trophy is flagged missable (Positive Mental Attitude). That follows the sources: it is the only one the list can lock you out of. A reader expecting a longer missables page may find the section thin, but padding it with guesses would be worse.
- The anchor: the repository's first anchor commit carried a wrong drand signature for round 34100825 (verified against drand quicknet: the signature on file did not match). The signature was corrected to the verified one and the anchor re-created before the build commit. The anchor round (34100825) is after the competition opened.
- Screenshots are 1280x800 JPEGs; the checklist cover shows the top of the list only. The detail pane covers part of the checklist behind it by design.
