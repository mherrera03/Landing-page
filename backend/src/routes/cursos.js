// Rutas de cursos
// Por ahora solo lectura pública. El CRUD protegido (admin) se agrega en la fase de autenticación.
import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/cursos -> cursos visibles, en orden
router.get('/', (req, res) => {
  const cursos = db.prepare('SELECT * FROM cursos WHERE visible = 1 ORDER BY orden, id').all();
  res.json(cursos);
});

export default router;
