// filters.js — the checklist's filters and the spoiler rule.
// A story trophy is a spoiler while it is unearned and the spoiler setting
// is on: its name and description stay hidden, but its grade and its place
// in the list still show, so the checklist keeps its shape.

export const FILTER_KINDS = ['all', 'story', 'missable', 'collectible', 'activity', 'robbery'];

/** The default filter state. */
export function defaultFilters() {
  return { kind: 'all', query: '', hideEarned: false, spoilers: true };
}

/** Does one trophy pass the kind chip? */
export function passesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kind === kind;
}

/** Does one trophy pass the search box? */
export function passesQuery(trophy, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const hay = [trophy.name, trophy.description, trophy.guide || '']
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

/** Apply every filter to the list. */
export function applyFilters(trophies, filters, earned) {
  return trophies.filter((t) => {
    if (!passesKind(t, filters.kind)) return false;
    if (!passesQuery(t, filters.query)) return false;
    if (filters.hideEarned && earned.has(t.id)) return false;
    return true;
  });
}

/** Is this trophy's name and description hidden by the spoiler setting? */
export function isSpoilerHidden(trophy, filters, earned) {
  if (!filters.spoilers) return false;
  if (earned.has(trophy.id)) return false;
  return trophy.kind === 'story' || trophy.hidden === true;
}

/** The text shown in place of a hidden trophy's name. */
export function spoilerName(trophy) {
  return 'Hidden trophy — earn it to reveal';
}

/** The text shown in place of a hidden trophy's description. */
export function spoilerDescription() {
  return 'A story trophy. Its name and description stay hidden until you earn it.';
}
