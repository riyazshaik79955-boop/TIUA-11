/* ============================================================
   TIUA — Internal Marks Calculator
   Formula:
   (Higher CT x 0.66) + (Lower CT x 0.33) +
   (Higher MID x 0.66) + (Lower MID x 0.33) +
   Assignment  =  Final Internal Marks (out of 40)
   ============================================================ */

function renderCalcSubjectOptions(){
  const select = document.getElementById('calc-subject');
  if(!select) return;
  const codes = Object.keys(SUBJECTS).filter(c => c !== 'IE');
  select.innerHTML = `<option value="">Select subject…</option>` +
    codes.map(code => `<option value="${code}">${code} — ${SUBJECTS[code].name}</option>`).join('');
}

function resultTier(score){
  if(score >= 36) return { emoji:'🔥', title:'Super Brooo!!', sub:'Outstanding Performance 🚀', tone:'tier-fire' };
  if(score >= 25) return { emoji:'😎', title:'Ahhaa...', sub:'Parledhu Bane Undhi...', tone:'tier-cool' };
  if(score >= 20) return { emoji:'🌚', title:'Just Miss Bayyooo...', sub:'So close, push a little more.', tone:'tier-moon' };
  return { emoji:'😂', title:'Naa Mata Vini Nuv Chadhuvu Maneeyy!!', sub:'Time to lock in and grind.', tone:'tier-oof' };
}

function calculateInternal(){
  const ct1 = parseFloat(document.getElementById('calc-ct1').value) || 0;
  const ct2 = parseFloat(document.getElementById('calc-ct2').value) || 0;
  const mid1 = parseFloat(document.getElementById('calc-mid1').value) || 0;
  const mid2 = parseFloat(document.getElementById('calc-mid2').value) || 0;
  const assignment = parseFloat(document.getElementById('calc-assignment').value) || 0;

  const higherCT = Math.max(ct1, ct2);
  const lowerCT  = Math.min(ct1, ct2);
  const higherMID = Math.max(mid1, mid2);
  const lowerMID  = Math.min(mid1, mid2);

  const total = (higherCT*0.66) + (lowerCT*0.33) + (higherMID*0.66) + (lowerMID*0.33) + assignment;
  showResult(total);
}

function showResult(total){
  const card = document.getElementById('calc-result-card');
  const scoreEl = document.getElementById('calc-result-score');
  const emojiEl = document.getElementById('calc-result-emoji');
  const titleEl = document.getElementById('calc-result-title');
  const subEl = document.getElementById('calc-result-sub');
  const barEl = document.getElementById('calc-result-bar');

  const tier = resultTier(total);
  const clamped = Math.max(0, Math.min(total, 40));

  card.classList.remove('tier-fire','tier-cool','tier-moon','tier-oof');
  card.classList.add(tier.tone);

  scoreEl.textContent = `${total.toFixed(2)} / 40`;
  emojiEl.textContent = tier.emoji;
  titleEl.textContent = tier.title;
  subEl.textContent = tier.sub;
  barEl.style.width = `${(clamped/40)*100}%`;

  card.classList.remove('hidden');
  card.classList.remove('pop-in');
  void card.offsetWidth; // restart animation
  card.classList.add('pop-in');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCalcSubjectOptions();
  document.getElementById('calc-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateInternal();
  });
  document.getElementById('calc-reset')?.addEventListener('click', () => {
    document.getElementById('calc-form').reset();
    document.getElementById('calc-result-card').classList.add('hidden');
  });
});
