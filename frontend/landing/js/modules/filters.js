// Filtro de cursos por categoría
export function initFilters(){
  const filters = document.querySelectorAll('.filter');
  const courses = document.querySelectorAll('.course');
  filters.forEach(btn=>{
    btn.addEventListener('click',()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      courses.forEach(c=>{
        c.style.display=(f==='all'||c.dataset.category===f)?'flex':'none';
      });
    });
  });
}
