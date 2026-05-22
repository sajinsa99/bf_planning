'use strict';

const NAMES = [null, 'Yann', 'Bruno'];
const SLOT_DISPLAY = { 'Yann': 'Yann', 'Yann+cat': 'Yann 🐱', 'Bruno': 'Bruno', 'Bruno+cat': 'Bruno 🐱' };
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
let schedule = {};
let schedule2 = {};
let editMode = false;
let filter = 'all';
let selectedSlots = new Set(); // keys: "year-month-day-slot"
let password = sessionStorage.getItem('bf_password') || '';
let holidays = new Map(); // key: "YYYYMMDD", value: holiday name
let filterDay = null;
let currentUser = sessionStorage.getItem('bf_user') || null;

function secondMonth() {
  if (currentMonth === 12) return [currentYear + 1, 1];
  return [currentYear, currentMonth + 1];
}

function applyUser(user) {
  currentUser = user;
  sessionStorage.setItem('bf_user', user);
  filter = user;
  document.getElementById('filter-select').value = user;
}

function showWelcomeDialog() {
  const dialog = document.getElementById('welcome-dialog');
  document.getElementById('welcome-step-who').hidden = false;
  document.getElementById('welcome-step-pwd').hidden = true;
  document.getElementById('welcome-pwd-error').hidden = true;
  dialog.addEventListener('cancel', e => e.preventDefault());
  dialog.showModal();
}

function initFilters() {
  const monthSel = document.getElementById('month-select');
  MONTHS_FR.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.textContent = name;
    monthSel.appendChild(opt);
  });
  const daySel = document.getElementById('day-select');
  const none = document.createElement('option');
  none.value = '';
  none.textContent = 'Jour';
  daySel.appendChild(none);
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    daySel.appendChild(opt);
  }
}

async function loadHolidays() {
  try {
    const res = await fetch('public_holidays.ics');
    const text = await res.text();
    const events = text.split('BEGIN:VEVENT');
    for (const ev of events.slice(1)) {
      const dm = ev.match(/DTSTART;VALUE=DATE:(\d{8})/);
      const sm = ev.match(/SUMMARY:(.+)/);
      if (dm && sm) holidays.set(dm[1], sm[1].trim());
    }
  } catch { /* static file unavailable */ }
}

function isPastDay(year, month, day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month - 1, day) < today;
}

async function fetchSchedule() {
  const [y2, m2] = secondMonth();
  try {
    const [r1, r2] = await Promise.all([
      fetch(`api/schedule/${currentYear}/${currentMonth}`),
      fetch(`api/schedule/${y2}/${m2}`)
    ]);
    schedule = await r1.json();
    schedule2 = await r2.json();
  } catch {
    schedule = {};
    schedule2 = {};
  }
  renderCalendar();
}

function renderMonthPanel(container, year, month, sched, isCurrent = false) {
  const panel = document.createElement('div');
  panel.className = 'month-panel' + (isCurrent ? ' current-month' : '');

  const title = document.createElement('div');
  title.className = 'month-panel-title';
  title.textContent = `${MONTHS_FR[month - 1]} ${year}`;
  panel.appendChild(title);

  const header = document.createElement('div');
  header.className = 'calendar-grid';
  ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(d => {
    const div = document.createElement('div');
    div.className = 'day-header';
    div.textContent = d;
    header.appendChild(div);
  });
  panel.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  if (filterDay !== null) grid.classList.add('single-day');

  const today = new Date();
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  if (filterDay === null) {
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'day-cell empty-cell';
      grid.appendChild(empty);
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (filterDay !== null && day !== filterDay) continue;
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const locked = isPastDay(year, month, day);
    if (locked) cell.classList.add('locked-day');

    const dayOfWeek = new Date(year, month - 1, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) cell.classList.add('weekend');

    const isToday = today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day;
    if (isToday) cell.classList.add('today');

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = day;
    cell.appendChild(num);

    const yyyymmdd = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    const holidayName = holidays.get(yyyymmdd);
    if (holidayName) {
      cell.classList.add('holiday');
      const hSpan = document.createElement('span');
      hSpan.className = 'holiday-label';
      hSpan.textContent = ' 🎉';
      hSpan.dataset.holiday = holidayName;
      hSpan.title = holidayName;
      num.appendChild(hSpan);
    }

    for (const slot of ['morning', 'evening']) {
      const slotEl = document.createElement('div');
      const value = sched[String(day)] && sched[String(day)][slot] != null ? sched[String(day)][slot] : null;
      const cssClass = value ? (value.startsWith('Yann') ? 'yann' : 'bruno') : 'empty';
      slotEl.className = `slot ${cssClass}`;

      const label = document.createElement('span');
      label.className = 'slot-label';
      label.textContent = slot === 'morning' ? 'Matin' : 'Soir';

      const name = document.createElement('span');
      name.className = 'slot-name';
      name.textContent = value ? (SLOT_DISPLAY[value] || value) : '—';

      slotEl.appendChild(label);
      slotEl.appendChild(name);
      slotEl.dataset.year = year;
      slotEl.dataset.month = month;
      slotEl.dataset.day = day;
      slotEl.dataset.slot = slot;

      const key = `${year}-${month}-${day}-${slot}`;
      if (!locked && selectedSlots.has(key)) slotEl.classList.add('selected');
      if (!editMode && filter !== 'all') {
        const isMatch = filter === 'Manquant' ? value === null
          : filter === 'Yann' ? (value === 'Yann' || value === 'Yann+cat')
          : filter === 'Bruno' ? (value === 'Bruno' || value === 'Bruno+cat')
          : value === filter;
        if (!isMatch) slotEl.classList.add('filtered-out');
      }
      if (!locked) slotEl.addEventListener('click', handleSlotClick);
      cell.appendChild(slotEl);
    }

    grid.appendChild(cell);
  }

  panel.appendChild(grid);
  container.appendChild(panel);
}

function renderCalendar() {
  const [y2, m2] = secondMonth();

  const titleText = y2 !== currentYear
    ? `${MONTHS_FR[currentMonth - 1]} ${currentYear} — ${MONTHS_FR[m2 - 1]} ${y2}`
    : `${MONTHS_FR[currentMonth - 1]} — ${MONTHS_FR[m2 - 1]} ${currentYear}`;
  document.getElementById('month-title').textContent = titleText;

  document.getElementById('month-select').value = currentMonth;
  document.getElementById('day-select').value = filterDay ?? '';
  document.getElementById('filter-select').value = filter;
  document.getElementById('view-filters').hidden = editMode;
  document.getElementById('reset-filters').hidden = filterDay === null;

  const container = document.getElementById('dual-calendar');
  container.innerHTML = '';
  renderMonthPanel(container, currentYear, currentMonth, schedule, true);
  renderMonthPanel(container, y2, m2, schedule2, false);
  container.classList.toggle('edit-mode', editMode);

  document.getElementById('edit-banner').hidden = !editMode;
  document.querySelector('header').classList.toggle('edit-mode', editMode);
  document.getElementById('edit-toggle').classList.toggle('active', editMode);
  document.getElementById('edit-toggle').textContent = editMode ? 'Quitter édition' : 'Mode édition';
  document.getElementById('filter-select').hidden = editMode;
  document.getElementById('edit-toggle').hidden = currentUser !== 'Bruno';

  const actionBar = document.getElementById('action-bar');
  actionBar.hidden = !editMode || selectedSlots.size === 0;
  if (editMode && selectedSlots.size > 0) {
    const n = selectedSlots.size;
    document.getElementById('selection-count').textContent =
      `${n} créneau${n > 1 ? 'x' : ''} sélectionné${n > 1 ? 's' : ''}`;
  }
}

function handleSlotClick(e) {
  if (!editMode) return;
  const year = parseInt(e.currentTarget.dataset.year, 10);
  const month = parseInt(e.currentTarget.dataset.month, 10);
  const day = String(parseInt(e.currentTarget.dataset.day, 10));
  const slot = e.currentTarget.dataset.slot;
  const key = `${year}-${month}-${day}-${slot}`;

  if (selectedSlots.has(key)) {
    selectedSlots.delete(key);
  } else {
    selectedSlots.add(key);
  }
  renderCalendar();
}

async function applyToSelected(value) {
  if (selectedSlots.size === 0) return;

  const [y2, m2] = secondMonth();
  let modifiedMonth1 = false, modifiedMonth2 = false;

  for (const key of selectedSlots) {
    const parts = key.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parts[2];
    const slot = parts[3];

    if (year === currentYear && month === currentMonth) {
      if (!schedule[day]) schedule[day] = { morning: null, evening: null };
      schedule[day][slot] = value;
      modifiedMonth1 = true;
    } else {
      if (!schedule2[day]) schedule2[day] = { morning: null, evening: null };
      schedule2[day][slot] = value;
      modifiedMonth2 = true;
    }
  }

  selectedSlots.clear();

  const saves = [];
  if (modifiedMonth1) saves.push(saveSchedule(currentYear, currentMonth, schedule));
  if (modifiedMonth2) saves.push(saveSchedule(y2, m2, schedule2));
  await Promise.all(saves);

  renderCalendar();
}

function clearSelection() {
  selectedSlots.clear();
  renderCalendar();
}

async function saveSchedule(year, month, data) {
  try {
    const res = await fetch(`api/schedule/${year}/${month}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': password
      },
      body: JSON.stringify(data)
    });
    if (res.status === 401) {
      exitEditMode();
      alert('Session expirée, veuillez vous reconnecter.');
    }
  } catch {
    // network error, silently ignore
  }
}

function exitEditMode() {
  editMode = false;
  password = '';
  selectedSlots.clear();
  sessionStorage.removeItem('bf_password');
  renderCalendar();
}

async function toggleEditMode() {
  if (editMode) {
    exitEditMode();
    return;
  }

  if (password) {
    const res = await fetch('api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.ok) {
      editMode = true;
      renderCalendar();
      return;
    }
    password = '';
    sessionStorage.removeItem('bf_password');
  }

  showPasswordDialog();
}

function showPasswordDialog() {
  const dialog = document.getElementById('password-dialog');
  const input = document.getElementById('password-input');
  const error = document.getElementById('password-error');
  input.value = '';
  error.hidden = true;
  dialog.showModal();
  input.focus();
}

document.getElementById('password-submit').addEventListener('click', async () => {
  const input = document.getElementById('password-input');
  const error = document.getElementById('password-error');
  const candidate = input.value;

  const res = await fetch('api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: candidate })
  });
  const data = await res.json();

  if (data.ok) {
    password = candidate;
    sessionStorage.setItem('bf_password', password);
    editMode = true;
    document.getElementById('password-dialog').close();
    renderCalendar();
  } else {
    error.hidden = false;
    input.value = '';
    input.focus();
  }
});

document.getElementById('password-cancel').addEventListener('click', () => {
  document.getElementById('password-dialog').close();
});

document.getElementById('password-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('password-submit').click();
});

document.getElementById('filter-select').addEventListener('change', (e) => {
  filter = e.target.value;
  renderCalendar();
});

document.getElementById('apply-yann').addEventListener('click', () => applyToSelected('Yann'));
document.getElementById('apply-yann-cat').addEventListener('click', () => applyToSelected('Yann+cat'));
document.getElementById('apply-bruno').addEventListener('click', () => applyToSelected('Bruno'));
document.getElementById('apply-bruno-cat').addEventListener('click', () => applyToSelected('Bruno+cat'));
document.getElementById('apply-clear').addEventListener('click', () => applyToSelected(null));
document.getElementById('deselect-all').addEventListener('click', clearSelection);

document.getElementById('edit-toggle').addEventListener('click', toggleEditMode);

document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 1) { currentMonth = 12; currentYear--; }
  selectedSlots.clear();
  fetchSchedule();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 12) { currentMonth = 1; currentYear++; }
  selectedSlots.clear();
  fetchSchedule();
});

document.getElementById('refresh-view').addEventListener('click', () => {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;
  filterDay = null;
  filter = 'all';
  document.getElementById('filter-select').value = 'all';
  selectedSlots.clear();
  fetchSchedule();
});

document.getElementById('month-select').addEventListener('change', (e) => {
  currentMonth = parseInt(e.target.value, 10);
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  if (filterDay !== null && filterDay > daysInMonth) filterDay = null;
  selectedSlots.clear();
  fetchSchedule();
});

document.getElementById('day-select').addEventListener('change', (e) => {
  filterDay = e.target.value ? parseInt(e.target.value, 10) : null;
  renderCalendar();
});

document.getElementById('reset-filters').addEventListener('click', () => {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;
  filterDay = null;
  selectedSlots.clear();
  fetchSchedule();
});

document.getElementById('welcome-yann').addEventListener('click', () => {
  applyUser('Yann');
  document.getElementById('welcome-dialog').close();
  renderCalendar();
});

document.getElementById('welcome-bruno').addEventListener('click', () => {
  document.getElementById('welcome-step-who').hidden = true;
  document.getElementById('welcome-step-pwd').hidden = false;
  document.getElementById('welcome-pwd-input').value = '';
  document.getElementById('welcome-pwd-input').focus();
});

document.getElementById('welcome-pwd-submit').addEventListener('click', async () => {
  const input = document.getElementById('welcome-pwd-input');
  const error = document.getElementById('welcome-pwd-error');
  const candidate = input.value;
  const res = await fetch('api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: candidate })
  });
  const data = await res.json();
  if (data.ok) {
    password = candidate;
    sessionStorage.setItem('bf_password', password);
    editMode = true;
    applyUser('Bruno');
    document.getElementById('welcome-dialog').close();
    renderCalendar();
  } else {
    error.hidden = false;
    input.value = '';
    input.focus();
  }
});

document.getElementById('welcome-pwd-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('welcome-pwd-submit').click();
});

document.getElementById('welcome-pwd-skip').addEventListener('click', () => {
  applyUser('Bruno');
  document.getElementById('welcome-dialog').close();
  renderCalendar();
});

initFilters();
if (currentUser) filter = currentUser;
loadHolidays().then(() => {
  fetchSchedule();
  if (!currentUser) showWelcomeDialog();
});
