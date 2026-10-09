const KEY = 'birthday-brew';
const DAY = 864e5;
const $ = id => document.getElementById(id);

// Load saved roommates (falls back to an empty list if storage is unavailable)
let people = [];
try { people = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { people = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(people)); } catch (e) {} };

// Work out the next occurrence of a birthday
function info(p) {
  const [y, m, d] = p.date.split('-').map(Number);
  const t = new Date();
  const today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  let yr = t.getFullYear();
  let next = Date.UTC(yr, m - 1, d);
  if (next < today) { yr++; next = Date.UTC(yr, m - 1, d); }
  return { days: Math.round((next - today) / DAY), turning: yr - y, date: new Date(next) };
}

const fmt = d => d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', timeZone: 'UTC' });
const label = n => n === 0 ? 'Today! 🎉' : n === 1 ? 'Tomorrow' : n + ' days';
const sorted = () => people.map(p => ({ ...p, ...info(p) })).sort((a, b) => a.days - b.days);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Draw the house menu
function render() {
  const s = sorted();
  $('list').innerHTML = s.length
    ? s.map(p => `<li><div class="n">${esc(p.name)}<div class="d">${fmt(p.date)}</div></div><div class="badge">${label(p.days)}</div><button class="x" data-id="${p.id}" aria-label="Remove ${esc(p.name)}">✕</button></li>`).join('')
    : '<p class="empty">The menu is empty. Add your first roommate above.</p>';
}

// Add a roommate
$('f').addEventListener('submit', e => {
  e.preventDefault();
  people.push({ id: Date.now().toString(36), name: $('name').value.trim(), date: $('date').value });
  save();
  $('f').reset();
  render();
});

// Remove a roommate
$('list').addEventListener('click', e => {
  const b = e.target.closest('.x');
  if (!b) return;
  people = people.filter(p => p.id !== b.dataset.id);
  save();
  render();
});

// The big red button
$('big').addEventListener('click', () => {
  const r = $('result');
  const s = sorted();
  if (!s.length) {
    r.innerHTML = '<span class="hint">No birthdays yet. Add a roommate below!</span>';
    return;
  }
  const p = s[0];
  const also = s.filter(x => x.days === p.days && x.id !== p.id).map(x => esc(x.name));
  const names = [esc(p.name), ...also].join(' &amp; ');
  const msg = p.days === 0
    ? `Happy birthday, ${p.name}! 🎂`
    : `Heads up: ${p.name}'s birthday is ${p.days === 1 ? 'tomorrow' : 'in ' + p.days + ' days'} (${fmt(p.date)}). Cake? Card? Let's plan!`;

  r.innerHTML = `<div class="pop">
    <div class="who">${names}</div>
    <div class="when">${p.days === 0 ? "🎉 It's today!" : label(p.days) + ' away · ' + fmt(p.date)}</div>
    <div class="hint">${p.turning > 0 && p.turning < 120 ? 'Turning ' + p.turning : ''}</div>
    <button class="copy" id="cp">Copy reminder for the group chat</button>
  </div>`;

  $('cp').onclick = async () => {
    try { await navigator.clipboard.writeText(msg); $('cp').textContent = 'Copied! ✓'; }
    catch (e) { $('cp').textContent = msg; }
  };
});

render();
