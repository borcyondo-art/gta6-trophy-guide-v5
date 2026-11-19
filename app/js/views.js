// views.js — turns the trophy data into the pages the reader sees.
// Every view is built from the same data, so the checklist, the roadmap and
// the missables page can never disagree about a trophy.

import { GRADE_LABEL, KIND_LABEL, ROADMAP, SOURCES, countByGrade, trophyById } from './data.js';
import { applyFilters, isSpoilerHidden, spoilerDescription, spoilerName } from './filters.js';

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function medalNode(grade) {
  const m = el('span', 'medal ' + grade, GRADE_LABEL[grade].slice(0, 4));
  m.title = GRADE_LABEL[grade];
  return m;
}

function tagNode(cls, text) {
  return el('span', 'tag ' + cls, text);
}

/** One checklist row. Clicking it (not its checkbox) opens the detail pane. */
export function trophyRow(trophy, earned, filters, onToggle, onOpen) {
  const li = el('li', 'trophy' + (earned.has(trophy.id) ? ' earned' : ''));
  li.dataset.id = trophy.id;

  const hidden = isSpoilerHidden(trophy, filters, earned);
  if (hidden) li.classList.add('spoiler-hidden');

  li.appendChild(medalNode(trophy.grade));

  const body = el('div', 'trophy-body');
  body.appendChild(el('h3', 'trophy-name', hidden ? spoilerName(trophy) : trophy.name));
  body.appendChild(el('p', 'trophy-desc', hidden ? spoilerDescription() : trophy.description));
  const tags = el('div', 'trophy-tags');
  tags.appendChild(tagNode('kind', KIND_LABEL[trophy.kind] || trophy.kind));
  if (trophy.hidden) tags.appendChild(tagNode('hidden', 'Hidden'));
  if (trophy.missable) tags.appendChild(tagNode('missable', 'Missable'));
  if (trophy.target !== null && trophy.target !== undefined) {
    tags.appendChild(tagNode('', 'Target: ' + trophy.target));
  }
  body.appendChild(tags);
  li.appendChild(body);

  const check = el('div', 'trophy-check');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
  box.addEventListener('click', (ev) => {
    ev.stopPropagation();
    onToggle(trophy.id, box.checked);
  });
  check.appendChild(box);
  check.appendChild(el('span', 'grade-label', GRADE_LABEL[trophy.grade]));
  li.appendChild(check);

  li.addEventListener('click', () => onOpen(trophy.id));
  return li;
}

/** The checklist view: filters + rows + the count line. */
export function renderChecklist(listEl, countEl, emptyEl, trophies, earned, filters, onToggle, onOpen) {
  const shown = applyFilters(trophies, filters, earned);
  listEl.innerHTML = '';
  for (const t of shown) {
    listEl.appendChild(trophyRow(t, earned, filters, onToggle, onOpen));
  }
  countEl.textContent =
    'Showing ' + shown.length + ' of ' + trophies.length + ' trophies — ' +
    earned.size + ' earned.';
  emptyEl.hidden = shown.length !== 0;
}

/** The progress header: big count, bar and per-grade counts. */
export function renderProgress(trophies, earned) {
  const count = document.getElementById('earnedCount');
  const fill = document.getElementById('progressFill');
  const bar = document.getElementById('progressBar');
  const grades = document.getElementById('gradeCounts');
  count.textContent = String(earned.size);
  const pct = Math.round((earned.size / trophies.length) * 100);
  fill.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', String(earned.size));
  const by = countByGrade(trophies, earned);
  grades.innerHTML =
    'Platinum <b>' + by.platinum + '/1</b> · Gold <b>' + by.gold + '/2</b> · Silver <b>' +
    by.silver + '/6</b> · Bronze <b>' + by.bronze + '/46</b> · ' + pct + '%';
}

/** The roadmap view: six stages with their trophies. */
export function renderRoadmap(stagesEl, trophies, earned, onOpen) {
  stagesEl.innerHTML = '';
  for (const stage of ROADMAP) {
    const li = el('li', 'stage');
    li.appendChild(el('h3', '', stage.title));
    li.appendChild(el('p', 'stage-count', stage.count));
    li.appendChild(el('p', '', stage.body));
    const ul = el('ul');
    for (const id of stage.trophies) {
      const t = trophyById(trophies, id);
      if (!t) continue;
      const item = el('li', '');
      const link = el('a', '', (earned.has(id) ? '✓ ' : '') + t.name + ' (' + GRADE_LABEL[t.grade] + ')');
      link.href = '#/trophy/' + id;
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        onOpen(id);
      });
      item.appendChild(link);
      ul.appendChild(item);
    }
    li.appendChild(ul);
    stagesEl.appendChild(li);
  }
}

/** The missables view: the flagged trophies plus the time-sensitive notes. */
export function renderMissables(listEl, noteEl, trophies, earned, filters, onToggle, onOpen) {
  const flagged = trophies.filter((t) => t.missable);
  listEl.innerHTML = '';
  for (const t of flagged) {
    listEl.appendChild(trophyRow(t, earned, filters, onToggle, onOpen));
  }
  noteEl.innerHTML = '';
  noteEl.appendChild(el('h3', '', 'Time-sensitive, not missable'));
  noteEl.appendChild(el('p', '', 'Strangers & Freaks has a time-sensitive race: Race Against Yago in Chapter 3 carries an hourglass icon, so run it the moment it appears and save first. The five side-story finales (Kenton, Billy, Andy, Randy, Tyrone) stay open after the main story ends. Everything outside the story stays available after the credits, including the side-story finales and the 100% checklist.'));
}

/** The sources view: who each fact comes from. */
export function renderSources(listEl) {
  listEl.innerHTML = '';
  for (const s of SOURCES) {
    const li = el('li', '');
    li.appendChild(el('strong', '', s.name));
    li.appendChild(el('p', '', s.what));
    listEl.appendChild(li);
  }
}

/** The detail pane for one trophy: guide, sources and warnings. */
export function renderDetail(bodyEl, trophy, earned) {
  bodyEl.innerHTML = '';
  bodyEl.appendChild(medalNode(trophy.grade));
  bodyEl.appendChild(el('h2', '', trophy.name));
  bodyEl.appendChild(el('p', 'desc', trophy.description));
  const tags = el('div', 'trophy-tags');
  tags.appendChild(tagNode('kind', KIND_LABEL[trophy.kind] || trophy.kind));
  tags.appendChild(tagNode('', GRADE_LABEL[trophy.grade]));
  if (trophy.hidden) tags.appendChild(tagNode('hidden', 'Hidden'));
  if (trophy.missable) tags.appendChild(tagNode('missable', 'Missable'));
  if (trophy.target !== null && trophy.target !== undefined) {
    tags.appendChild(tagNode('', 'Target: ' + trophy.target));
  }
  bodyEl.appendChild(tags);
  if (trophy.missable) {
    bodyEl.appendChild(el('p', 'warn', 'Missable — this one can be locked out. Read the guide before you pass Chapter 1.'));
  }
  const guide = el('p', 'guide', trophy.guide || '');
  bodyEl.appendChild(guide);
  // The guide text itself ends with its Sources sentence, so there is no
  // second sources line here.
  const state = el('p', 'src', earned.has(trophy.id) ? 'Earned — ticked in your checklist.' : 'Not earned yet.');
  bodyEl.appendChild(state);
}
