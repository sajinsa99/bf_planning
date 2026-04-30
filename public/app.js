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
let password = sessionStorage.getItem('bf_password') || '';

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

    const isToday = today.getFullYear() === currentYear &&
      today.getMonth() + 1 === currentMonth &&
      today.getDate() === day;
    if (isToday) cell.classList.add('today');

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = day;
    cell.appendChild(num);

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
      slotEl.addEventListener('click', handleSlotClick);
      cell.appendChild(slotEl);
    }

    grid.appendChild(cell);
  }

  document.getElementById('calendar').classList.toggle('edit-mode', editMode);
  document.getElementById('edit-banner').hidden = !editMode;
  document.querySelector('header').classList.toggle('edit-mode', editMode);
  document.getElementById('edit-toggle').classList.toggle('active', editMode);
  document.getElementById('edit-toggle').textContent = editMode ? 'Quitter édition' : 'Mode édition';
}

async function handleSlotClick(e) {
  if (!editMode) return;
  const day = String(parseInt(e.currentTarget.dataset.day, 10));
  const slot = e.currentTarget.dataset.slot;

  if (!schedule[day]) schedule[day] = { morning: null, evening: null };
  const current = schedule[day][slot];
  const idx = NAMES.indexOf(current);
  schedule[day][slot] = NAMES[(idx + 1) % NAMES.length];

  await saveSchedule();
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

  const res = await fetch('/api/auth', {
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

document.getElementById('edit-toggle').addEventListener('click', toggleEditMode);

document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 1) { currentMonth = 12; currentYear--; }
  fetchSchedule();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 12) { currentMonth = 1; currentYear++; }
  fetchSchedule();
});

fetchSchedule();
