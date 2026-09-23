// Dashboard del panel admin: navegación entre secciones
// PENDIENTE: proteger con JWT y agregar formularios de crear/editar/ocultar.
const titles = { cursos:'Cursos', eventos:'Eventos', solicitudes:'Solicitudes', configuracion:'Configuración' };
const title = document.getElementById('sectionTitle');
const body = document.getElementById('sectionBody');

// Escapa texto antes de meterlo en innerHTML
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

async function renderCursos(){
  const cursos = await fetch('/api/cursos').then(r => r.json());
  body.innerHTML = `<p class="muted">${cursos.length} cursos en la base de datos:</p>
    <ul>${cursos.map(c => `<li><b>${esc(c.titulo)}</b> · ${esc(c.categoria)} · ${esc(c.estado)}</li>`).join('')}</ul>`;
}

async function renderEventos(){
  const eventos = await fetch('/api/eventos').then(r => r.json());
  body.innerHTML = `<p class="muted">${eventos.length} eventos en la base de datos:</p>
    <ul>${eventos.map(e => `<li><b>${esc(e.titulo)}</b> · ${esc(e.etiqueta)}</li>`).join('')}</ul>`;
}

const renderers = { cursos:renderCursos, eventos:renderEventos };

function show(){
  const key = location.hash.slice(1) || 'cursos';
  title.textContent = titles[key] || 'Cursos';
  document.querySelectorAll('.side-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + key));
  const render = renderers[key];
  if (render) render().catch(() => { body.innerHTML = '<p class="msg">No se pudo conectar con la API.</p>'; });
  else body.innerHTML = '<p class="muted">Sección en construcción.</p>';
}

window.addEventListener('hashchange', show);
show();
