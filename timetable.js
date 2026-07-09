/* ============================================================
   TIUA — Timetable Module
   Source: Siddhartha Academy of Higher Education
   Dept. of Electronics & Instrumentation Engineering
   Class III/IV EIE — Section B — Room 445 — w.e.f. 22-06-2026
   ============================================================ */

/* ---- Subject master data (exactly as printed on the timetable) ---- */
const SUBJECTS = {
  '24EI301':  { name: 'Process Control',                         faculty: 'Dr. A. Sumalatha' },
  '24EI302':  { name: 'Digital Signal Processing',                faculty: 'Dr. S. Srinivasulu Raju' },
  '24EI303':  { name: 'VLSI Design',                              faculty: 'Dr. N. Swathi' },
  '24EI310C': { name: 'Robotics and Control',                     faculty: 'Dr. K. Vijaya Lakshmi' },
  '24UC302':  { name: 'Environmental Science',                   faculty: 'Dr. C. L. Monica' },
  '24EI381':  { name: 'EPICS',                                    faculty: 'Dr. S. Kalpana' },
  '24EI382':  { name: 'Digital System Design Using Verilog',      faculty: 'Dr. S. Srinivasulu Raju / Dr. S. Kalpana' },
  '24EI383':  { name: 'Process Control Lab',                      faculty: 'Dr. P. Durga Prasada Rao / Dr. P. Srinivas' },
  '24EI384':  { name: 'Virtual Instrumentation Lab',              faculty: 'Mrs. Ch. Jaya Lakshmi / Dr. M. Srinivas' },
  'TP':       { name: 'Soft Skills (T&P)',                        faculty: 'Dr. D. Sridevi' },
  'IE':       { name: 'Industry / Institute Elective',            faculty: '—' }
};

/* ---- Weekly schedule, transcribed exactly from the printed timetable ---- */
const TIMETABLE = {
  1: [ // Monday
    { start:'09:30', end:'10:20', codes:['IE'] },
    { start:'10:20', end:'11:10', codes:['24EI302'] },
    { start:'11:10', end:'11:20', type:'break' },
    { start:'11:20', end:'12:10', codes:['24EI303'] },
    { start:'12:10', end:'13:00', codes:['24EI301'] },
    { start:'13:00', end:'14:00', type:'lunch' },
    { start:'14:00', end:'15:40', codes:['24EI381','24EI382'] },
    { start:'15:40', end:'16:30', type:'special', label:'EPICS' }
  ],
  2: [ // Tuesday
    { start:'09:30', end:'10:20', codes:['IE'] },
    { start:'10:20', end:'11:10', codes:['24EI301'] },
    { start:'11:10', end:'11:20', type:'break' },
    { start:'11:20', end:'12:10', codes:['24EI302'] },
    { start:'12:10', end:'13:00', codes:['24EI310C'] },
    { start:'13:00', end:'14:00', type:'lunch' },
    { start:'14:00', end:'14:50', codes:['24UC302'] },
    { start:'14:50', end:'15:40', codes:['TP'] },
    { start:'15:40', end:'16:30', type:'special', label:'Counselling' }
  ],
  3: [ // Wednesday
    { start:'09:30', end:'10:20', codes:['IE'] },
    { start:'10:20', end:'11:10', codes:['24EI310C'] },
    { start:'11:10', end:'11:20', type:'break' },
    { start:'11:20', end:'12:10', codes:['24EI301'] },
    { start:'12:10', end:'13:00', codes:['24EI303'] },
    { start:'13:00', end:'14:00', type:'lunch' },
    { start:'14:00', end:'15:40', codes:['24EI383','24EI384'] }
  ],
  4: [ // Thursday
    { start:'09:30', end:'10:20', codes:['24EI302'] },
    { start:'10:20', end:'11:10', codes:['24EI303'] },
    { start:'11:10', end:'11:20', type:'break' },
    { start:'11:20', end:'13:00', codes:['24EI381','24EI382'] },
    { start:'13:00', end:'14:00', type:'lunch' },
    { start:'14:00', end:'14:50', codes:['24UC302'] },
    { start:'14:50', end:'15:40', codes:['TP'] },
    { start:'15:40', end:'16:30', type:'special', label:'Minors / Honors' }
  ],
  5: [ // Friday
    { start:'09:30', end:'10:20', codes:['24EI310C'] },
    { start:'10:20', end:'13:00', codes:['24EI384','24EI383'] },
    { start:'13:00', end:'14:00', type:'lunch' },
    { start:'14:00', end:'14:50', codes:['24EI302'] },
    { start:'14:50', end:'15:40', type:'special', label:'EPICS' },
    { start:'15:40', end:'16:30', type:'special', label:'Minors / Honors' }
  ],
  6: [ // Saturday
    { start:'09:30', end:'10:20', codes:['24EI303'] },
    { start:'10:20', end:'11:10', codes:['24EI301'] },
    { start:'11:10', end:'11:20', type:'break' },
    { start:'11:20', end:'12:10', codes:['24EI310C'] },
    { start:'12:10', end:'13:00', type:'special', label:'Minors / Honors' }
  ],
  0: [] // Sunday — holiday
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ---- helpers ---- */
function to12h(t){
  const [h,m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2,'0')} ${period}`;
}
function minutesOf(t){
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}
function isNow(start,end){
  const now = new Date();
  const cur = now.getHours()*60 + now.getMinutes();
  return cur >= minutesOf(start) && cur < minutesOf(end);
}

/* ---- card builders ---- */
function classCard(slot){
  const codes = slot.codes;
  const names = codes.map(c => SUBJECTS[c]?.name || c).join(' / ');
  const faculties = [...new Set(codes.map(c => SUBJECTS[c]?.faculty || '—'))].join(' / ');
  const codeLabel = codes.join(' / ');
  const live = isNow(slot.start, slot.end);

  return `
  <div class="reveal glass card-hover rounded-2xl p-5 relative ${live ? 'ring-2 ring-[var(--accent2)]' : ''}">
    ${live ? '<span class="absolute -top-2.5 right-4 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-[var(--accent2)] text-[#04211f]">NOW</span>' : ''}
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-medium text-[var(--accent2)] tracking-wide">${to12h(slot.start)} – ${to12h(slot.end)}</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-[var(--muted)]">${codeLabel}</span>
    </div>
    <h4 class="font-display font-semibold text-base leading-snug mb-1">${names}</h4>
    <p class="text-xs text-[var(--muted)]">${faculties}</p>
  </div>`;
}

function breakCard(kind){
  const cfg = kind === 'lunch'
    ? { icon:'🍴', label:'Lunch Break', sub:'1:00 PM – 2:00 PM' }
    : { icon:'☕', label:'Short Break', sub:'11:10 AM – 11:20 AM' };
  return `
  <div class="reveal rounded-2xl p-5 border border-dashed border-white/15 flex items-center gap-4 bg-white/[0.03]">
    <span class="text-2xl">${cfg.icon}</span>
    <div>
      <p class="font-display font-medium text-sm">${cfg.label}</p>
      <p class="text-xs text-[var(--muted)]">${cfg.sub}</p>
    </div>
  </div>`;
}

function specialCard(slot){
  return `
  <div class="reveal glass card-hover rounded-2xl p-5 relative ${isNow(slot.start,slot.end) ? 'ring-2 ring-[var(--gold)]' : ''}">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-medium text-[var(--accent2)] tracking-wide">${to12h(slot.start)} – ${to12h(slot.end)}</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-[var(--muted)]">Activity</span>
    </div>
    <h4 class="font-display font-semibold text-base">${slot.label}</h4>
  </div>`;
}

/* ---- main render ---- */
function renderTodayTimetable(){
  const container = document.getElementById('today-timetable-grid');
  const dayLabelEl = document.getElementById('today-day-label');
  if(!container) return;

  const day = new Date().getDay();
  if(dayLabelEl) dayLabelEl.textContent = DAY_NAMES[day];

  const slots = TIMETABLE[day];

  if(!slots || slots.length === 0){
    container.innerHTML = `
      <div class="col-span-full reveal glass rounded-3xl p-10 text-center">
        <p class="text-4xl mb-3">🌤️</p>
        <p class="font-display font-semibold text-lg">No classes today</p>
        <p class="text-sm text-[var(--muted)] mt-1">Enjoy your day off — see you next class day.</p>
      </div>`;
    return;
  }

  container.innerHTML = slots.map(slot => {
    if(slot.type === 'break') return breakCard('break');
    if(slot.type === 'lunch') return breakCard('lunch');
    if(slot.type === 'special') return specialCard(slot);
    return classCard(slot);
  }).join('');

  container.querySelectorAll('.reveal').forEach(el => window.tiuaObserve?.(el));
}

/* also render the full week grid used inside the "Timetable" full view */
function renderFullWeek(){
  const wrap = document.getElementById('full-week-wrap');
  if(!wrap) return;
  const order = [1,2,3,4,5,6];
  wrap.innerHTML = order.map(day => {
    const slots = TIMETABLE[day];
    const rows = slots.map(slot => {
      let label, sub, tone = 'text-[var(--text)]';
      if(slot.type === 'break'){ label='Break'; sub=''; tone='text-[var(--muted)]'; }
      else if(slot.type === 'lunch'){ label='Lunch'; sub=''; tone='text-[var(--muted)]'; }
      else if(slot.type === 'special'){ label = slot.label; sub=''; }
      else { label = slot.codes.map(c=>SUBJECTS[c]?.name||c).join(' / '); sub = slot.codes.join('/'); }
      return `<div class="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
        <span class="text-xs text-[var(--muted)] w-28 shrink-0">${to12h(slot.start)} – ${to12h(slot.end)}</span>
        <span class="text-sm ${tone} flex-1 px-3">${label}</span>
        <span class="text-[10px] text-[var(--muted)]">${sub}</span>
      </div>`;
    }).join('');
    return `
    <div class="reveal glass rounded-3xl p-6">
      <h4 class="font-display font-semibold mb-3">${DAY_NAMES[day]}</h4>
      ${rows}
    </div>`;
  }).join('');
  wrap.querySelectorAll('.reveal').forEach(el => window.tiuaObserve?.(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderTodayTimetable();
  renderFullWeek();
  setInterval(renderTodayTimetable, 60000); // refresh "NOW" highlight every minute
});
