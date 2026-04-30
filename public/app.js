'use strict';

const NAMES = [null, 'Yann', 'Bruno'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
let schedule = {};
let editMode = false;
let filter = 'all';
let selectedSlots = new Set(); // keys: "day-slot" e.g. "5-morning"
let password = sessionStorage.getItem('bf_password') || '';
let holidays = new Map(); // key: "YYYYMMDD", value: holiday name

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
  try {
    const res = await fetch(`api/schedule/${currentYear}/${currentMonth}`);
    schedule = await res.json();
  } catch {
    schedule = {};
  }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('month-title').textContent =
    `${MONTHS_FR[currentMonth - 1]} ${currentYear}`;

  const grid = document.getElementById('calendar');
  grid.innerHTML = '';

  const today = new Date();
  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Monday=0 offset
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell empty-cell';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const locked = isPastDay(currentYear, currentMonth, day);
    if (locked) cell.classList.add('locked-day');

    const isToday = today.getFullYear() === currentYear &&
      today.getMonth() + 1 === currentMonth &&
      today.getDate() === day;
    if (isToday) cell.classList.add('today');

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = day;
    cell.appendChild(num);

    const yyyymmdd = `${currentYear}${String(currentMonth).padStart(2,'0')}${String(day).padStart(2,'0')}`;
    const holidayName = holidays.get(yyyymmdd);
    if (holidayName) {
      cell.classList.add('holiday');
      const hLabel = document.createElement('div');
      hLabel.className = 'holiday-label';
      hLabel.textContent = '🎉';
      hLabel.dataset.holiday = holidayName;
      hLabel.title = holidayName;
      cell.appendChild(hLabel);
    }

    for (const slot of ['morning', 'evening']) {
      const slotEl = document.createElement('div');
      const value = schedule[String(day)] && schedule[String(day)][slot] != null ? schedule[String(day)][slot] : null;
      const nameClass = value ? value.toLowerCase() : 'empty';
      slotEl.className = `slot ${nameClass}`;

      const label = document.createElement('span');
      label.className = 'slot-label';
      label.textContent = slot === 'morning' ? 'Matin' : 'Soir';

      const name = document.createElement('span');
      name.className = 'slot-name';
      name.textContent = value || '—';

      slotEl.appendChild(label);
      slotEl.appendChild(name);
      slotEl.dataset.day = day;
      slotEl.dataset.slot = slot;
      if (!locked && selectedSlots.has(`${day}-${slot}`)) slotEl.classList.add('selected');
      if (filter !== 'all' && value !== filter) slotEl.classList.add('filtered-out');
      if (!locked) slotEl.addEventListener('click', handleSlotClick);
      cell.appendChild(slotEl);
    }

    grid.appendChild(cell);
  }

  document.getElementById('calendar').classList.toggle('edit-mode', editMode);
  document.getElementById('edit-banner').hidden = !editMode;
  document.querySelector('header').classList.toggle('edit-mode', editMode);
  document.getElementById('edit-toggle').classList.toggle('active', editMode);
  document.getElementById('edit-toggle').textContent = editMode ? 'Quitter édition' : 'Mode édition';
  document.getElementById('filter-select').hidden = editMode;

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
  const day = String(parseInt(e.currentTarget.dataset.day, 10));
  const slot = e.currentTarget.dataset.slot;
  const key = `${day}-${slot}`;

  if (selectedSlots.has(key)) {
    selectedSlots.delete(key);
  } else {
    selectedSlots.add(key);
  }
  renderCalendar();
}

async function applyToSelected(value) {
  if (selectedSlots.size === 0) return;
  for (const key of selectedSlots) {
    const dash = key.indexOf('-');
    const day = key.slice(0, dash);
    const slot = key.slice(dash + 1);
    if (!schedule[day]) schedule[day] = { morning: null, evening: null };
    schedule[day][slot] = value;
  }
  selectedSlots.clear();
  await saveSchedule();
  renderCalendar();
}

function clearSelection() {
  selectedSlots.clear();
  renderCalendar();
}

async function saveSchedule() {
  try {
    const res = await fetch(`api/schedule/${currentYear}/${currentMonth}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': password
      },
      body: JSON.stringify(schedule)
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
document.getElementById('apply-bruno').addEventListener('click', () => applyToSelected('Bruno'));
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

loadHolidays().then(fetchSchedule);
