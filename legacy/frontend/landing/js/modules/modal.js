// Modal de ficha de curso / inscripción
// Se abre con cualquier elemento que tenga data-modal="clave" y se cierra con data-modal-close.
import { courseData, inscripcionGeneral } from '../data/cursos.js';

const modal = document.getElementById('modal');

function openModal(key){
  const c = courseData[key] || inscripcionGeneral;
  document.getElementById('modalCategory').textContent = c.cat;
  document.getElementById('modalTitle').textContent = c.title;
  document.getElementById('modalDesc').textContent = c.desc;
  document.getElementById('modalStudents').textContent = c.students;
  document.getElementById('modalLevel').textContent = c.level;
  document.getElementById('modalDuration').textContent = c.duration;
  document.getElementById('modalBanner').style.background = c.grad;
  modal.classList.add('show');
}

function closeModal(){
  modal.classList.remove('show');
}

export function initModal(){
  document.querySelectorAll('[data-modal]').forEach(el=>
    el.addEventListener('click',()=>openModal(el.dataset.modal))
  );
  document.querySelectorAll('[data-modal-close]').forEach(el=>
    el.addEventListener('click',closeModal)
  );
  modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
}
