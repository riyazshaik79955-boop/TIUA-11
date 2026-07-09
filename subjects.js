/* ============================================================
   TIUA — Subjects & Question Papers Module
   Files are uploaded by Admin only. Students can VIEW only —
   no download controls are rendered anywhere in this module.
   ============================================================ */

/* Category keys shown inside a subject's resource modal */
const RESOURCE_CATEGORIES = [
  { key:'notes',  label:'Notes',  icon:'📘' },
  { key:'pdfs',   label:'PDFs',   icon:'📄' },
  { key:'ppts',   label:'PPTs',   icon:'📊' },
  { key:'docx',   label:'DOCX',   icon:'📝' },
  { key:'images', label:'Images', icon:'🖼️' },
  { key:'videos', label:'Videos', icon:'🎬' }
];

/* Admin-uploaded material store. Empty by default — wire this to your
   backend/admin panel by pushing objects like:
   { title:'Unit 1 Notes', url:'/files/xyz.pdf' } into the right array. */
const SUBJECT_FILES = Object.fromEntries(
  Object.keys(SUBJECTS).map(code => [code, { notes:[], pdfs:[], ppts:[], docx:[], images:[], videos:[] }])
);

/* Question papers store — same idea, admin-managed. */
const QUESTION_PAPERS = Object.fromEntries(
  Object.keys(SUBJECTS).filter(c => c !== 'IE' && c !== 'TP').map(code => [code, []])
);

/* ---- render subject grid ---- */
function renderSubjectGrid(){
  const grid = document.getElementById('subjects-grid');
  if(!grid) return;
  const codes = Object.keys(SUBJECTS).filter(c => c !== 'IE');

  grid.innerHTML = codes.map(code => {
    const s = SUBJECTS[code];
    const fileCount = Object.values(SUBJECT_FILES[code]).reduce((a,b)=>a+b.length,0);
    return `
    <button data-code="${code}" class="subject-card reveal glass card-hover rounded-3xl p-6 text-left group">
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent1)]/25 to-[var(--accent2)]/25 flex items-center justify-center mb-5 group-hover:from-[var(--accent1)]/45 group-hover:to-[var(--accent2)]/45 transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-[var(--accent2)]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
      </div>
      <span class="text-[10px] tracking-wide text-[var(--muted)]">${code}</span>
      <h4 class="font-display font-semibold text-base mt-1 mb-1 leading-snug">${s.name}</h4>
      <p class="text-xs text-[var(--muted)]">${s.faculty}</p>
      <p class="text-[10px] text-[var(--accent2)] mt-4">${fileCount} file${fileCount!==1?'s':''} available →</p>
    </button>`;
  }).join('');

  grid.querySelectorAll('.subject-card').forEach(btn => {
    btn.addEventListener('click', () => openResourceModal(btn.dataset.code, 'subject'));
  });
  grid.querySelectorAll('.reveal').forEach(el => window.tiuaObserve?.(el));
}

/* ---- render question-paper subject grid ---- */
function renderQPGrid(){
  const grid = document.getElementById('qp-grid');
  if(!grid) return;
  const codes = Object.keys(QUESTION_PAPERS);

  grid.innerHTML = codes.map(code => {
    const s = SUBJECTS[code];
    const count = QUESTION_PAPERS[code].length;
    return `
    <button data-code="${code}" class="qp-card reveal glass card-hover rounded-3xl p-6 text-left group">
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--gold)]/25 to-[var(--accent1)]/25 flex items-center justify-center mb-5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-[var(--gold)]"><path d="M9 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l5-5Z"/><path d="M9 3v5H4"/></svg>
      </div>
      <span class="text-[10px] tracking-wide text-[var(--muted)]">${code}</span>
      <h4 class="font-display font-semibold text-base mt-1 mb-1 leading-snug">${s.name}</h4>
      <p class="text-[10px] text-[var(--accent2)] mt-4">${count} paper${count!==1?'s':''} available →</p>
    </button>`;
  }).join('');

  grid.querySelectorAll('.qp-card').forEach(btn => {
    btn.addEventListener('click', () => openResourceModal(btn.dataset.code, 'qp'));
  });
  grid.querySelectorAll('.reveal').forEach(el => window.tiuaObserve?.(el));
}

/* ---- shared modal (view-only, no download anywhere) ---- */
let activeModalCode = null;
let activeModalMode = 'subject';
let activeCategory = 'notes';

function openResourceModal(code, mode){
  activeModalCode = code;
  activeModalMode = mode;
  activeCategory = 'notes';

  const modal = document.getElementById('resource-modal');
  const titleEl = document.getElementById('resource-modal-title');
  const subEl = document.getElementById('resource-modal-sub');
  const tabsEl = document.getElementById('resource-modal-tabs');

  const s = SUBJECTS[code];
  titleEl.textContent = s.name;
  subEl.textContent = `${code} · ${s.faculty}`;

  if(mode === 'qp'){
    tabsEl.classList.add('hidden');
    renderFileList(QUESTION_PAPERS[code] || []);
  } else {
    tabsEl.classList.remove('hidden');
    tabsEl.innerHTML = RESOURCE_CATEGORIES.map((c,i) => `
      <button data-cat="${c.key}" class="cat-tab text-xs px-3.5 py-1.5 rounded-full border transition-all ${i===0 ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-[var(--muted)] hover:border-white/20'}">
        ${c.icon} ${c.label}
      </button>`).join('');
    tabsEl.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('bg-white/10','border-white/20','text-white'));
        tab.classList.add('bg-white/10','border-white/20','text-white');
        activeCategory = tab.dataset.cat;
        renderFileList(SUBJECT_FILES[code][activeCategory]);
      });
    });
    renderFileList(SUBJECT_FILES[code].notes);
  }

  modal.classList.remove('pointer-events-none','opacity-0');
  modal.querySelector('.modal-panel').classList.remove('scale-95','opacity-0');
  document.body.style.overflow = 'hidden';
}

function closeResourceModal(){
  const modal = document.getElementById('resource-modal');
  modal.classList.add('opacity-0');
  modal.querySelector('.modal-panel').classList.add('scale-95','opacity-0');
  setTimeout(() => modal.classList.add('pointer-events-none'), 300);
  document.body.style.overflow = '';
  closeViewer();
}

function renderFileList(files){
  const listEl = document.getElementById('resource-file-list');
  closeViewer();
  if(!files || files.length === 0){
    listEl.innerHTML = `
      <div class="text-center py-14">
        <p class="text-3xl mb-3">🗂️</p>
        <p class="text-sm text-[var(--muted)]">No files uploaded yet by admin.</p>
      </div>`;
    return;
  }
  listEl.innerHTML = files.map((f,i) => `
    <button class="file-row w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all text-left" data-idx="${i}">
      <span class="flex items-center gap-3 min-w-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-[var(--accent2)] shrink-0"><path d="M9 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l5-5Z"/><path d="M9 3v5H4"/></svg>
        <span class="text-sm truncate">${f.title}</span>
      </span>
      <span class="text-[10px] text-[var(--accent2)] shrink-0">View →</span>
    </button>`).join('');

  listEl.querySelectorAll('.file-row').forEach(row => {
    row.addEventListener('click', () => openViewer(files[row.dataset.idx]));
  });
}

function openViewer(file){
  const viewer = document.getElementById('resource-viewer');
  const frame = document.getElementById('resource-viewer-frame');
  const label = document.getElementById('resource-viewer-title');
  label.textContent = file.title;
  frame.src = file.url || 'about:blank';
  viewer.classList.remove('hidden');
}
function closeViewer(){
  const viewer = document.getElementById('resource-viewer');
  const frame = document.getElementById('resource-viewer-frame');
  if(!viewer) return;
  viewer.classList.add('hidden');
  frame.src = 'about:blank';
}

document.addEventListener('DOMContentLoaded', () => {
  renderSubjectGrid();
  renderQPGrid();
  document.getElementById('resource-modal-close')?.addEventListener('click', closeResourceModal);
  document.getElementById('resource-modal')?.addEventListener('click', (e) => {
    if(e.target.id === 'resource-modal') closeResourceModal();
  });
  document.getElementById('resource-viewer-close')?.addEventListener('click', closeViewer);
});
