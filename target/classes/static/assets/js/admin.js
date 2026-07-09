// MySafeSpeak — Admin role scripts.
// Currently powers:
//  - admin/admin-add-user.html (role chip selection)
//  - admin/admin-roles-permissions.html (permission checkbox toggling)

function selectRole(el){
  document.querySelectorAll('.role-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

document.querySelectorAll('.check:not(.locked)').forEach(c => c.addEventListener('click', () => {
  c.classList.toggle('on');
  c.textContent = c.classList.contains('on') ? '✓' : '';
}));
