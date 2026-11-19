// data.js — loads the trophy list and names its parts.
// The list is the official PlayStation list (55 trophies) with a guide in
// our own words for each one. Nothing here is fetched from the network at
// run time beyond this app's own data file.

export const DATA_URL = './data/trophies.json';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_LABEL = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABEL = {
  story: 'Story',
  collectible: 'Collectible',
  activity: 'Activity',
  robbery: 'Robbery',
  platinum: 'Platinum',
};

export const SOURCES = [
  {
    name: 'Exophase — GTA 6 trophy list',
    what: 'The official trophy names, descriptions and grades, as PlayStation publishes them, and the PSN progress targets.',
  },
  {
    name: 'PSNProfiles — GTA 6 trophies',
    what: 'The same 55 names, descriptions and grades, cross-checked against Exophase, plus the progress counts PlayStation tracks.',
  },
  {
    name: 'Push Square — GTA 6 Trophy Guide & Roadmap',
    what: 'The 100% completion checklist (35 tasks, 18 card sets, 15 needed for 100%), the ~200-hour estimate and the roadmap order.',
  },
  {
    name: 'Output Lag — GTA 6 Trophy List',
    what: 'Unlock methods for the visible and hidden trophies, the missable warning, and the note that five cryptic trophies have no confirmed method at launch.',
  },
  {
    name: 'GamesRadar+ / PC Gamer — GTA 6 trophy list',
    what: 'An independent listing of the same 55 names, tiers and Gamerscore, checked against the trackers above.',
  },
];

/** The six roadmap stages, built from the official descriptions. */
export const ROADMAP = [
  {
    title: 'Play the story, keep chapter saves',
    count: '17 story trophies',
    body: 'Finish Chapters 1 to 4 and the final mission. The 12 main-story trophies and the 5 side-story finales all pop from missions, and the chapter trophies can pop at the start of the next chapter. There is no mission replay and no New Game Plus, so keep one manual save at the start of every chapter and one untouched save from just before the final mission.',
    trophies: ['just-like-paradise', 'paradise-lost', 'ts-ass-drug-money', 'vice-city-baby', 'top-of-the-world-ma', 'you-gotta-know-when-to-get-off', 'trust', 'break-the-bank', 'family-matters', 'dwnfall', 'hi-jacked', 'snow-storm', 'this-was-no-boat-accident', 'the-lone-rider', 'road-to-rehabilitation', 'supply-and-demand', 'spin-on-this'],
  },
  {
    title: 'Do the one missable thing early',
    count: '1 missable trophy',
    body: 'Positive Mental Attitude is the only trophy the list can lock you out of: the Chapter 1 balcony meditation disappears once Chapter 1 ends. After Lucia is home, check the kitchen in the morning after the mission Down to Earth, follow her to the balcony and accept the optional task. Bring your partner to every other meditation spot too — each outdoor spot should count twice.',
    trophies: ['positive-mental-attitude'],
  },
  {
    title: 'Robberies, once the tools arrive',
    count: '7 robbery trophies',
    body: 'The robbery tools arrive through optional and story missions in Chapters 3 and 4: the Snap Gun from Yasmani\u2019s Jewelry Jobs, bank vaults from That\u2019s Where The Money Is near the end of Chapter 4. Do the vaults with your partner — you cannot carry all the bags alone — and escaping one with your partner also earns Hot Together.',
    trophies: ['sneakthief', 'retail-therapy', 'maximum-withdrawal', 'hot-together', 'a-classic-blitz-play', 'pest-control', 'dime-on-the-dollar'],
  },
  {
    title: 'Collectibles and the map',
    count: '5 collectible trophies',
    body: 'Cards (18 sets, 3 for the trophy, 15 for 100%), vehicles (scan them with WAiNK as you drive — 100 for the trophy, 200 for 100%), garages (8, from the Real Estate app after Daily Driver), registrations (10, from the Scooter Bros app after Moses) and exploring all of Leonida. Work on these during normal travel instead of leaving them all to the end.',
    trophies: ['dont-touch-my-deck', 'whip-it-good', 'the-goodtime-state', 'little-boxes', 'on-the-spot'],
  },
  {
    title: 'Activities and the long grind',
    count: '23 activity trophies',
    body: 'Stunts (250 for the trophy, 300 for 100%, 397 in the world), shooting-range golds (42 across two ranges), 20 races, 50 challenges (70 of 80 for 100%), drone races at all 14 locations, fishing, arcade games, hunting, the gym and the cryptic one-offs. Most of these fill up during normal play; check Progress, Challenges regularly and mop up the easy ones between missions.',
    trophies: ['cunning-stunts', 'the-shootist', 'earn-cash-not-kudos', 'top-fun', 'one-last-thing', 'master-of-none', 'baited-my-tackle', 'stick-fiddler', 'gunslinger', 'fair-game', 'catch-me-if-you-can', 'challenging-tank', 'personal-best', 'actions-speak-louder', 'lets-go-bowling', 'ten-pin', 'in-the-beginning', 'capital-offense', 'bad-luck-i-guess', 'the-truth-is-out-there', 'treat-yo-self', 'strangers-and-freaks', 'you-wainker'],
  },
  {
    title: 'Cleanup and the platinum',
    count: '2 trophies',
    body: 'After the credits the 100% Completion checklist appears under Progress, Stats, 100% Completion. Finish its 35 tasks — story, card sets, stunts, vehicles, challenges, vaults and the rest — and A Long Road pops. Earn every other trophy and Vice Got a Price! follows on its own. Around 200 hours in all, and no second playthrough is needed.',
    trophies: ['a-long-road', 'vice-got-a-price'],
  },
];

let cache = null;

/** Fetch the trophy list once and keep it. */
export async function loadTrophies() {
  if (cache) return cache;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Could not load ' + DATA_URL);
  const data = await res.json();
  cache = Array.isArray(data) ? data : data.trophies;
  return cache;
}

/** Find one trophy by its id. */
export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

/** Count earned trophies by grade. */
export function countByGrade(trophies, earned) {
  const out = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    if (earned.has(t.id)) out[t.grade] = (out[t.grade] || 0) + 1;
  }
  return out;
}
