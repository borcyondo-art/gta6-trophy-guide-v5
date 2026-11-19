// main.js — boots the guide, wires the controls and routes the views.
// The checklist is the home view. #/roadmap, #/missables and #/sources open
// their pages; #/trophy/<id> opens one trophy's detail pane.

import { loadTrophies } from './data.js';
import { defaultFilters } from './filters.js';
import { exportText, loadEarned, loadSpoilers, parseImport, saveEarned, saveSpoilers } from './store.js';
import { renderChecklist, renderDetail, renderMissables, renderProgress, renderRoadmap, renderSources } from './views.js';

const VIEWS = ['checklist', 'roadmap', 'missables', 'sources'];

function $(id) {
  return document.getElementById(id);
}

function currentView() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === 'trophy' && parts[1]) return { view: 'checklist', trophy: parts[1] };
  if (VIEWS.includes(parts[0])) return { view: parts[0], trophy: null };
  return { view: 'checklist', trophy: null };
}

async function boot() {
  const trophies = await loadTrophies();
  const knownIds = new Set(trophies.map((t) => t.id));
  let earned = loadEarned(knownIds);
  const filters = defaultFilters();
  filters.spoilers = loadSpoilers();

  const spoilerToggle = $('spoilerToggle');
  spoilerToggle.checked = filters.spoilers;
  spoilerToggle.addEventListener('change', () => {
    filters.spoilers = spoilerToggle.checked;
    saveSpoilers(filters.spoilers);
    renderAll();
  });

  $('search').addEventListener('input', (ev) => {
    filters.query = ev.target.value;
    renderAll();
  });

  document.querySelectorAll('#filters .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#filters .chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      filters.kind = chip.dataset.kind;
      renderAll();
    });
  });

  $('hideEarned').addEventListener('change', (ev) => {
    filters.hideEarned = ev.target.checked;
    renderAll();
  });

  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob([exportText(earned)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leonida-legend-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      earned = parseImport(text, knownIds);
      saveEarned(earned);
      renderAll();
    } catch {
      window.alert('That file is not a Leonida Legend progress export.');
    }
    ev.target.value = '';
  });

  $('detailClose').addEventListener('click', closeDetail);
  $('detail').addEventListener('click', (ev) => {
    if (ev.target === $('detail')) closeDetail();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeDetail();
  });

  function toggleEarned(id, on) {
    if (on) earned.add(id);
    else earned.delete(id);
    saveEarned(earned);
    renderAll();
  }

  function openTrophy(id) {
    const trophy = trophies.find((t) => t.id === id);
    if (!trophy) return;
    renderDetail($('detailBody'), trophy, earned);
    $('detail').hidden = false;
  }

  function closeDetail() {
    $('detail').hidden = true;
    if (currentView().trophy) window.location.hash = '#/';
  }

  function showView(view) {
    for (const v of VIEWS) {
      $('view-' + v).hidden = v !== view;
    }
    document.querySelectorAll('#tabs a').forEach((a) => {
      a.classList.toggle('active', a.dataset.view === view);
    });
    if (view === 'roadmap') renderRoadmap($('roadmapStages'), trophies, earned, openTrophy);
    if (view === 'missables') renderMissables($('missableList'), $('missableNote'), trophies, earned, filters, toggleEarned, openTrophy);
    if (view === 'sources') renderSources($('sourceList'));
  }

  function renderAll() {
    renderProgress(trophies, earned);
    renderChecklist($('trophyList'), $('listCount'), $('emptyNote'), trophies, earned, filters, toggleEarned, openTrophy);
    const { view, trophy } = currentView();
    showView(view);
    if (trophy) openTrophy(trophy);
    else if (!$('detail').hidden) closeDetail();
  }

  window.addEventListener('hashchange', renderAll);
  renderAll();
}

boot().catch((err) => {
  const main = document.getElementById('main');
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = 'The guide could not load its trophy data (' + err.message + '). Open this page from its own files — it needs no network, but it does need its data file beside it.';
  main.prepend(p);
});
