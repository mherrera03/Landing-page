// Menú hamburguesa (móvil)
export function initMenu(){
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}
