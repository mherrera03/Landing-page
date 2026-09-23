// Rutas de autenticación del panel admin
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, requireAuth } from '../auth.js';

const router = Router();

// POST /api/auth/login  { correo, password } -> { token, usuario }
router.post('/login', (req, res) => {
  const correo = String(req.body?.correo || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE correo = ? AND activo = 1').get(correo);
  if (!usuario || !bcrypt.compareSync(password, usuario.password_hash)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  res.json({
    token: signToken(usuario),
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
  });
});

// GET /api/auth/me -> datos del usuario de la sesión actual
router.get('/me', requireAuth, (req, res) => {
  const usuario = db.prepare('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ? AND activo = 1').get(req.usuario.id);
  if (!usuario) return res.status(401).json({ error: 'Usuario no disponible' });
  res.json(usuario);
});

export default router;
