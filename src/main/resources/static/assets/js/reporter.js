// MySafeSpeak — Reporter role scripts.
// Currently powers the multi-step "Create report" flow
// (reporter/create-report.html).

function selectChip(el){
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleYesNo(el, condId){
  const row = el.parentElement;
  row.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  const cond = document.getElementById(condId);
  if(el.textContent.trim() === 'Yes'){ cond.classList.add('show'); } else { cond.classList.remove('show'); }
}

function goStep(n){
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  for(let i=1;i<=4;i++){
    const bar = document.getElementById('bar'+i);
    bar.classList.remove('current','done');
    if(i < n) bar.classList.add('done');
    if(i === n) bar.classList.add('current');
  }
  window.scrollTo({top:0, behavior:'smooth'});
}

function showSuccess(){
  document.getElementById('form-flow').style.display = 'none';
  document.getElementById('success').style.display = 'block';
}
