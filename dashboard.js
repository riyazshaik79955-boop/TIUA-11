/* ============================================================
   TIUA — Core Dashboard Module
   Greeting, live date, section navigation, sidebar, reveal-on-
   scroll, and shared micro-interactions (ripple, mobile toggle).
   ============================================================ */

const STUDENT = { name: 'Riyaz', role: 'III/IV EIE · Section B', roll: 'EIE-2026-014' };

/* ---- greeting ---- */
function updateGreeting(){
  const hour = new Date().getHours();
  let icon, text;
  if(hour >= 5 && hour < 12){ icon='🌅'; text='Good Morning'; }
  else if(hour >= 12 && hour < 17){ icon='☀️'; text='Good Afternoon'; }
  else if(hour >= 17 && hour < 21){ icon='🌆'; text='Good Evening'; }
  else { icon='🌙'; text='Good Night'; }

  const el = document.getElementById('greeting-text');
  if(el) el.innerHTML = `${icon} ${text}, <span class="grad-text">${STUDENT.name}</span> 👋`;
}

function updateDate(){
  const el = document.getElementById('today-date');
  if(!el) return;
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  el.textContent = new Date().toLocaleDateString('en-IN', opts);
}

function updateClock(){
  const el = document.getElementById('live-clock');
  if(!el) return;
  el.textContent = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

/* ---- scroll reveal (shared observer used by all modules) ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });

window.tiuaObserve = (el) => io.observe(el);

function observeAllReveals(){
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---- section navigation (SPA-style, single page) ---- */
const SECTIONS = ['overview','timetable','subjects','questionpapers','calculator','profile','settings'];

function goToSection(name){
  SECTIONS.forEach(s => {
    const el = document.getElementById(`view-${s}`);
    if(!el) return;
    el.classList.toggle('hidden', s !== name);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const isActive = link.dataset.section === name;
    link.classList.toggle('bg-white/10', isActive);
    link.classList.toggle('text-white', isActive);
    link.classList.toggle('text-[var(--muted)]', !isActive);
  });

  const pageTitle = document.getElementById('page-title');
  const titles = {
    overview:'Dashboard', timetable:"Today's Timetable", subjects:'Subjects',
    questionpapers:'Question Papers', calculator:'Internal Calculator',
    profile:'Profile', settings:'Settings'
  };
  if(pageTitle) pageTitle.textContent = titles[name] || 'Dashboard';

  // close mobile sidebar after navigating
  document.getElementById('sidebar')?.classList.add('-translate-x-full');
  document.getElementById('sidebar-overlay')?.classList.add('hidden');

  window.scrollTo({ top:0, behavior:'smooth' });
  requestAnimationFrame(observeAllReveals);
}

function initNav(){
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if(section === 'logout'){ handleLogout(); return; }
      goToSection(section);
    });
  });
}

function handleLogout(){
  const overlay = document.getElementById('page-transition');
  overlay.classList.add('active');
  setTimeout(() => { window.location.href = 'login.html'; }, 550);
}

/* ---- mobile sidebar toggle ---- */
function initSidebarToggle(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  document.getElementById('sidebar-open')?.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  });
  document.getElementById('sidebar-close')?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });
}

/* ---- ripple effect for any .ripple-btn ---- */
function initRipples(){
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple-btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}

/* ---- background particle blobs are pure CSS, no JS needed ---- */

document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  updateDate();
  updateClock();
  setInterval(updateClock, 30000);

  document.getElementById('student-name-badge').textContent = STUDENT.name;
  document.getElementById('student-role-badge').textContent = STUDENT.role;
  document.getElementById('profile-name').textContent = STUDENT.name;
  document.getElementById('profile-role').textContent = STUDENT.role;
  document.getElementById('profile-roll').textContent = STUDENT.roll;

  initNav();
  initSidebarToggle();
  initRipples();
  observeAllReveals();
  goToSection('overview');
});
