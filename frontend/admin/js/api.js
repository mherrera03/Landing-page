// Sesión del admin y llamadas a la API con el token JWT
const TOKEN_KEY = 'ugbplus_token';

export function getToken(){
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setToken(token){
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

export function logout(){
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
  location.href = '/admin/';
}

// fetch con el header Authorization. Si la sesión expiró, regresa al login.
export async function api(url, options = {}){
  const headers = { 'Content-Type':'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token) {
    logout();
    throw new Error('Sesión expirada');
  }
  if (!res.ok) throw new Error(data.error || 'Error de conexión');
  return data;
}
