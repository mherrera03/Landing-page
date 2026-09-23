// Rutas de eventos / noticias
// Por ahora solo lectura pública. El CRUD protegido (admin) se agrega en la fase de autenticación.
import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/eventos -> eventos visibles, en orden
router.get('/', (req, res) => {
  const eventos = db.prepare('SELECT * FROM eventos WHERE visible = 1 ORDER BY orden, id').all();
  res.json(eventos);
});

export default router;
