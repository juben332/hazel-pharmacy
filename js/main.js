import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { isAdmin } from './firebase-config.js';

// ── Auth Guard ──────────────────────────────────────────────────────────────
export function requireAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = '/index.html';
      return;
    }
    callback(user);
  });
}

export function requireAdmin(callback) {
  onAuthStateChanged(auth, user => {
    if (!user) { window.location.href = '/index.html'; return; }
    if (!isAdmin(user)) { window.location.href = '/pos.html'; return; }
    callback(user);
  });
}

// ── Sign Out ─────────────────────────────────────────────────────────────────
export async function handleSignOut() {
  try {
    await signOut(auth);
    window.location.href = '/index.html';
  } catch (e) {
    showToast('Sign out failed', 'error');
  }
}

// ── Toast Notifications ──────────────────────────────────────────────────────
export function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span class="toast__icon">${icons[type] || icons.info}</span><span class="toast__msg">${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--show'));

  setTimeout(() => {
    toast.classList.remove('toast--show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}

// ── Currency Formatter ───────────────────────────────────────────────────────
export function formatPeso(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Date Formatter ───────────────────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(ts) {
  if (!ts) return '—';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Badge helper ─────────────────────────────────────────────────────────────
export function statusBadge(status) {
  const map = {
    completed: 'badge--green',
    pending:   'badge--yellow',
    voided:    'badge--red',
    active:    'badge--green',
    inactive:  'badge--grey',
    low:       'badge--red',
    ok:        'badge--green',
  };
  return `<span class="badge ${map[status] || 'badge--grey'}">${status}</span>`;
}

// ── Debounce ─────────────────────────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Modal helpers ─────────────────────────────────────────────────────────────
export function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('modal--open'); document.body.style.overflow = 'hidden'; }
}

export function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('modal--open'); document.body.style.overflow = ''; }
}

// ── Sidebar active link ──────────────────────────────────────────────────────
export function setActiveSidebarLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar__link').forEach(a => {
    a.classList.toggle('sidebar__link--active', a.getAttribute('href') === path || path.endsWith(a.getAttribute('href')));
  });
}

// ── Topbar user info ─────────────────────────────────────────────────────────
export function populateTopbar(user) {
  const nameEl = document.getElementById('topbar-name');
  const roleEl = document.getElementById('topbar-role');
  if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
  if (roleEl) roleEl.textContent = isAdmin(user) ? 'Administrator' : 'Cashier';
}

// ── Activity log helper ──────────────────────────────────────────────────────
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function logActivity(user, action, details = {}) {
  try {
    await addDoc(collection(db, 'activityLog'), {
      userId: user.uid,
      userEmail: user.email,
      action,
      details,
      createdAt: serverTimestamp(),
    });
  } catch (_) {}
}
