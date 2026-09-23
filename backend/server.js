// Servidor UGB Plus
//   /          -> landing pública (frontend/landing)
//   /admin     -> panel administrativo (frontend/admin)
//   /shared    -> estilos compartidos (frontend/shared)
//   /api/...   -> API REST
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './src/db.js';
import cursosRoutes from './src/routes/cursos.js';
import eventosRoutes from './src/routes/eventos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.join(__dirname, '..', 'frontend');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Sin caché para HTML/JS/CSS: evita ver versiones viejas tras un cambio
app.use((req, res, next) => {
  if (/\.(html|js|css)$/.test(req.path) || req.path.endsWith('/')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// --- API ---
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/cursos', cursosRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// --- Frontend ---
app.use('/shared', express.static(path.join(FRONTEND, 'shared')));
app.use('/admin', express.static(path.join(FRONTEND, 'admin')));
app.use('/', express.static(path.join(FRONTEND, 'landing')));

app.listen(PORT, () => {
  console.log(`UGB Plus corriendo en http://localhost:${PORT}`);
  console.log(`Panel admin:        http://localhost:${PORT}/admin/`);
});
