// Login del panel admin
import { api, getToken, setToken } from './api.js';

// Si ya hay sesión, ir directo al dashboard
if (getToken()) location.replace('/admin/dashboard.html');

const form = document.getElementById('loginForm');
const msg = document.getElementById('loginMsg');
const btn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Ingresando…';

  try {
    const { token } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo: form.correo.value, password: form.password.value })
    });
    setToken(token);
    location.replace('/admin/dashboard.html');
  } catch (err) {
    msg.textContent = err.message;
    btn.disabled = false;
    btn.textContent = 'Ingresar';
  }
});
