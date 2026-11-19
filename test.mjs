// test.mjs — the local test suite for Leonida Legend.
// Run with: node test.mjs
// It checks the trophy data against the official list's shape, the app's
// files and references, the entry program, and the screenshots.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const APP = join(ROOT, 'app');

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond) {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push(name);
    console.log('FAIL: ' + name);
  }
}

// --- the trophy data -------------------------------------------------------

const trophies = JSON.parse(readFileSync(join(APP, 'data/trophies.json'), 'utf8')).trophies;

check('trophies.json holds 55 trophies', trophies.length === 55);

const grades = {};
for (const t of trophies) grades[t.grade] = (grades[t.grade] || 0) + 1;
check('1 platinum', grades.platinum === 1);
check('2 gold', grades.gold === 2);
check('6 silver', grades.silver === 6);
check('46 bronze', grades.bronze === 46);
check('28 hidden', trophies.filter((t) => t.hidden).length === 28);
check('1 missable (Positive Mental Attitude)', trophies.filter((t) => t.missable).length === 1);
check('missable one is Positive Mental Attitude', trophies.find((t) => t.missable)?.name === 'Positive Mental Attitude');

const ids = new Set();
const names = new Set();
for (const t of trophies) {
  check('id present for ' + (t.name || '?'), typeof t.id === 'string' && t.id.length > 0);
  check('name present for ' + t.id, typeof t.name === 'string' && t.name.trim().length > 0);
  check('description present for ' + t.id, typeof t.description === 'string' && t.description.trim().length > 0);
  check('guide present and not blank for ' + t.id, typeof t.guide === 'string' && t.guide.trim().length > 20);
  check('grade valid for ' + t.id, ['platinum', 'gold', 'silver', 'bronze'].includes(t.grade));
  check('kind valid for ' + t.id, ['platinum', 'story', 'collectible', 'activity', 'robbery'].includes(t.kind));
  check('sources cited for ' + t.id, Array.isArray(t.sources) && t.sources.length > 0);
  check('id unique for ' + t.id, !ids.has(t.id));
  ids.add(t.id);
  check('name unique for ' + t.id, !names.has(t.name));
  names.add(t.name);
}

const EXPECTED_NAMES = [
  'Vice Got a Price!', 'A Long Road', 'Cunning Stunts', 'The Shootist', 'Maximum Withdrawal',
  'Strangers & Freaks', "Don't Touch My Deck", 'You WAiNKer!', 'Master of None', 'Earn Cash, Not Kudos',
  'Hot Together', 'Retail Therapy', 'Whip It Good', 'The Goodtime State', 'Pest Control',
  'Dime on the Dollar', 'Top Fun', 'Treat Yo Self', 'Little Boxes', 'On the Spot',
  'Baited My Tackle', 'Stick Fiddler', 'Positive Mental Attitude', 'Gunslinger', 'Sneakthief',
  'A Classic Blitz Play', 'One Last Thing', 'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money',
  'Vice City, Baby!', 'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank',
  'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'This Was No Boat Accident', 'The Lone Rider',
  'Road to Rehabilitation', 'Supply & Demand', 'Spin On This!', 'Fair Game', 'Catch Me If You Can',
  'Challenging Tank', "Let's Go Bowling", 'Personal Best', 'Actions Speak Louder', 'In The Beginning…',
  'Capital Offense', 'Bad Luck, I Guess', 'The Truth Is Out There', 'Ten Pin',
];
for (const name of EXPECTED_NAMES) {
  check('official name present: ' + name, names.has(name));
}
check('no extra names beyond the official 55', names.size === EXPECTED_NAMES.length);

// --- the app's files -------------------------------------------------------

for (const f of ['index.html', 'css/style.css', 'js/main.js', 'js/data.js', 'js/store.js', 'js/filters.js', 'js/views.js', 'data/trophies.json']) {
  check('app file exists: ' + f, existsSync(join(APP, f)));
}
check('main.ts exists', existsSync(join(ROOT, 'main.ts')));
check('vendor library exists', existsSync(join(ROOT, 'vendor/makefun-frontend.ts')));
check('serve.ts exists', existsSync(join(ROOT, 'serve.ts')));
check('LICENSE exists', existsSync(join(ROOT, 'LICENSE')));
check('README exists', existsSync(join(ROOT, 'README.md')));
check('shots.json exists', existsSync(join(ROOT, 'shots.json')));

// No network references anywhere under app/: the guide must work offline.
function walkFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
}
const appFiles = walkFiles(APP);
check('app/ has at most 993 entries', appFiles.length < 993);
let appBytes = 0;
for (const f of appFiles) appBytes += statSync(f).size;
check('app/ is under 48 MiB', appBytes < 48 * 1024 * 1024);
for (const f of appFiles) {
  const text = readFileSync(f, 'utf8');
  const rel = f.slice(APP.length + 1);
  check('no http URL in app/' + rel, !text.includes('http://') && !text.includes('https://'));
  check('no protocol-relative URL in app/' + rel, !text.includes('"//') && !text.includes("'//"));
}

const indexHtml = readFileSync(join(APP, 'index.html'), 'utf8');
check('index.html links the local stylesheet', indexHtml.includes('href="css/style.css"'));
check('index.html loads the local main module', indexHtml.includes('src="js/main.js"'));
check('index.html has the checklist tab', indexHtml.includes('data-view="checklist"'));
check('index.html has the roadmap tab', indexHtml.includes('data-view="roadmap"'));
check('index.html has the missables tab', indexHtml.includes('data-view="missables"'));
check('index.html has the sources tab', indexHtml.includes('data-view="sources"'));
check('index.html has a search box', indexHtml.includes('id="search"'));
check('index.html has a spoiler toggle', indexHtml.includes('id="spoilerToggle"'));
check('index.html has export and import', indexHtml.includes('id="exportBtn"') && indexHtml.includes('id="importBtn"'));
check('index.html is under 1 MiB', Buffer.byteLength(indexHtml, 'utf8') < 1024 * 1024);

// Every app script parses as a module.
for (const f of ['js/main.js', 'js/data.js', 'js/store.js', 'js/filters.js', 'js/views.js']) {
  try {
    execFileSync('node', ['--check', join(APP, f)], { stdio: 'pipe' });
    check('parses: app/' + f, true);
  } catch {
    check('parses: app/' + f, false);
  }
}

// --- the entry program, the readme and the license -------------------------

const mainTs = readFileSync(join(ROOT, 'main.ts'), 'utf8');
check('main.ts calls buildDossier', mainTs.includes('buildDossier'));
check('main.ts reads MAKEFUN_OUTPUT_DIR', mainTs.includes('MAKEFUN_OUTPUT_DIR'));
check('main.ts copies app/', mainTs.includes("cpSync(join(here, 'app')"));
check('main.ts copies screenshots/', mainTs.includes("cpSync(join(here, 'screenshots')"));
check('main.ts writes dossier.json', mainTs.includes('dossier.json'));
check('main.ts uses the vendored library', mainTs.includes('./vendor/makefun-frontend.ts'));
check('main.ts caps text at 163840', mainTs.includes('text_max_bytes: 163840'));
check('main.ts caps screenshots at 4 x 256 KiB', mainTs.includes('screenshots: { max: 4, max_bytes: 262144 }'));

const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
check('README has the competition badge', readme.includes('make.fun/badge/gta6-trophy-guide-01.svg'));
check('README has the rank badge', readme.includes('/borcyondo-art/gta6-trophy-guide-v5/rank.svg'));
check('README has the reward badge', readme.includes('/borcyondo-art/gta6-trophy-guide-v5/reward.svg'));
check('README links the bounty page', readme.includes('https://make.fun/bounty/gta6-trophy-guide-01'));

const license = readFileSync(join(ROOT, 'LICENSE'), 'utf8');
check('LICENSE declares SPDX MIT first', license.startsWith('SPDX-License-Identifier: MIT'));
check('LICENSE is the MIT text', license.includes('MIT License'));

const shots = JSON.parse(readFileSync(join(ROOT, 'shots.json'), 'utf8'));
check('shots.json lists 4 screenshots', Array.isArray(shots) && shots.length === 4);
for (const s of shots) {
  check('shot listed: ' + s.file, typeof s.file === 'string' && s.file.length > 0);
}

// --- the screenshots -------------------------------------------------------

const shotDir = join(ROOT, 'screenshots');
for (const s of shots) {
  const p = join(shotDir, s.file);
  check('screenshot exists: ' + s.file, existsSync(p));
  if (!existsSync(p)) continue;
  const size = statSync(p).size;
  check('screenshot under 256 KiB: ' + s.file, size <= 256 * 1024);
  const buf = readFileSync(p);
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  check('screenshot is JPEG or PNG: ' + s.file, isJpeg || isPng);
  if (isJpeg) {
    let w = 0;
    let h = 0;
    for (let i = 2; i + 9 < buf.length; i++) {
      if (buf[i] !== 0xff) continue;
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        h = buf.readUInt16BE(i + 5);
        w = buf.readUInt16BE(i + 7);
        break;
      }
    }
    check('screenshot parses as JPEG: ' + s.file, w > 0 && h > 0);
    if (w > 0) {
      check('screenshot long side at most 1280: ' + s.file, Math.max(w, h) <= 1280);
      check('screenshot short side at least 480: ' + s.file, Math.min(w, h) >= 480);
    }
  }
  if (isPng) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    check('screenshot long side at most 1280: ' + s.file, Math.max(w, h) <= 1280);
    check('screenshot short side at least 480: ' + s.file, Math.min(w, h) >= 480);
  }
}

// --- the dossier -----------------------------------------------------------

const outDir = join(ROOT, 'out');
try {
  execFileSync('node', ['main.ts'], { cwd: ROOT, env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir }, stdio: 'pipe' });
  check('main.ts runs', true);
} catch (err) {
  check('main.ts runs', false);
  console.log(String(err.stdout || '') + String(err.stderr || ''));
}
if (existsSync(join(outDir, 'dossier.json'))) {
  const dossier = JSON.parse(readFileSync(join(outDir, 'dossier.json'), 'utf8'));
  check('dossier.json parses', true);
  check('dossier schema is makefun/dossier/v1', dossier.schema === 'makefun/dossier/v1');
  check('dossier holds 4 images', Array.isArray(dossier.images) && dossier.images.length === 4);
  check('dossier text mentions the trophy list', typeof dossier.text === 'string' && dossier.text.includes('trophies.json'));
  check('dossier is at most 1.5 MiB', statSync(join(outDir, 'dossier.json')).size <= 1536 * 1024);
  check('dossier text is at most 163840 bytes', Buffer.byteLength(dossier.text, 'utf8') <= 163840);
} else {
  check('dossier.json exists', false);
}

// --- summary ---------------------------------------------------------------

console.log('\n' + passed + ' passed, ' + failed + ' failed, ' + (passed + failed) + ' checks');
if (failed > 0) {
  console.log('Failures:');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
