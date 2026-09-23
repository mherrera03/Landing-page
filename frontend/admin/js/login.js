// Login del panel admin
// PENDIENTE: conectar con POST /api/auth/login (JWT + bcrypt) en la fase de autenticación.
const form = document.getElementById('loginForm');
const msg = document.getElementById('loginMsg');

form.addEventListener('submit', e => {
  e.preventDefault();
  msg.textContent = 'El inicio de sesión aún no está conectado (fase de autenticación pendiente).';
});
