// Autenticación: firma y verificación de tokens JWT
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECRET_FILE = path.join(__dirname, '..', 'data', '.jwt-secret');

// El secreto se genera solo la primera vez y se guarda en data/.jwt-secret (no se sube a git)
fs.mkdirSync(path.dirname(SECRET_FILE), { recursive: true });
if (!fs.existsSync(SECRET_FILE)) {
  fs.writeFileSync(SECRET_FILE, crypto.randomBytes(48).toString('hex'));
}
const SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();

export function signToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    SECRET,
    { expiresIn: '8h' }
  );
}

// Middleware: exige un token válido en el header Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}
