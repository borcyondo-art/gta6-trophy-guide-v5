// store.js — saved progress, kept only in this browser.
// Nothing leaves the machine: export writes a file the reader downloads,
// import reads a file the reader picks. No cookies, no service worker.

export const STORAGE_KEY = 'leonida-legend-progress-v1';
export const SPOILER_KEY = 'leonida-legend-spoilers-v1';

/** Read the earned set from localStorage. Unknown ids are dropped. */
export function loadEarned(knownIds) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => knownIds.has(id)));
  } catch {
    return new Set();
  }
}

/** Write the earned set to localStorage. */
export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
  } catch {
    // Storage may be full or blocked; the checklist still works in memory.
  }
}

/** The progress file the export button downloads. */
export function exportText(earned) {
  return JSON.stringify(
    { app: 'leonida-legend', version: 1, earned: [...earned].sort() },
    null,
    2,
  );
}

/** Parse an imported progress file. Returns a Set of ids, or throws. */
export function parseImport(text, knownIds) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('Not a Leonida Legend progress file.');
  const ids = list.filter((id) => typeof id === 'string' && knownIds.has(id));
  return new Set(ids);
}

/** Read the spoiler setting (true = hide story trophies until earned). */
export function loadSpoilers() {
  try {
    return localStorage.getItem(SPOILER_KEY) !== 'off';
  } catch {
    return true;
  }
}

/** Write the spoiler setting. */
export function saveSpoilers(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
  } catch {
    // See saveEarned.
  }
}
