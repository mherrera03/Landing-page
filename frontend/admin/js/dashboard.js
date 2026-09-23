// Dashboard del panel admin: verificación de sesión + navegación entre secciones
// PENDIENTE: formularios de crear/editar/ocultar cursos y eventos.
import { api, getToken, logout } from './api.js';

// Sin token no se entra: de vuelta al login
if (!getToken()) location.replace('/admin/');

const titles = { cursos:'Cursos', eventos:'Eventos', solicitudes:'Solicitudes', configuracion:'Configuración' };
const title = document.getElementById('sectionTitle');
const body = document.getElementById('sectionBody');

// Escapa texto antes de meterlo en innerHTML
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

async function renderCursos(){
  const cursos = await api('/api/cursos');
  body.innerHTML = `<p class="muted">${cursos.length} cursos en la base de datos:</p>
    <ul>${cursos.map(c => `<li><b>${esc(c.titulo)}</b> · ${esc(c.categoria)} · ${esc(c.estado)}</li>`).join('')}</ul>`;
}

async function renderEventos(){
  const eventos = await api('/api/eventos');
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

async function init(){
  try {
    const usuario = await api('/api/auth/me');
    document.getElementById('userName').textContent = usuario.nombre;
    document.getElementById('userRole').textContent = usuario.rol;
  } catch {
    return logout();
  }
  document.body.classList.remove('auth-pending');
  document.getElementById('logoutBtn').addEventListener('click', logout);
  window.addEventListener('hashchange', show);
  show();
}

init();
