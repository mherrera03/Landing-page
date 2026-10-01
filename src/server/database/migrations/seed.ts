import "server-only";
import bcrypt from "bcryptjs";
import type { DatabaseSync } from "node:sqlite";
import { transaction } from "../connection";

/**
 * Datos iniciales. Solo se insertan si la tabla está vacía,
 * así nunca pisa lo que el admin haya creado.
 */
export function seed(db: DatabaseSync) {
  const hayUsuarios = db.prepare("SELECT COUNT(*) AS n FROM usuarios").get() as { n: number };
  if (hayUsuarios.n === 0) {
    // ⚠️ Usuario de PRUEBA. Cambiar la contraseña antes de pasar a producción.
    db.prepare("INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)").run(
      "Administrador",
      "admin@ugb.edu.sv",
      bcrypt.hashSync("admin123", 10),
      "admin",
    );
    console.log("[db] usuario inicial creado: admin@ugb.edu.sv");
  }

  const hayCursos = db.prepare("SELECT COUNT(*) AS n FROM cursos").get() as { n: number };
  if (hayCursos.n > 0) return;

  const insert = db.prepare(`
    INSERT INTO cursos (slug, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas,
                        modalidad, imagen, imagen_alt, estado, destacado, orden)
    VALUES (@slug, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas,
            @modalidad, @imagen, @imagen_alt, @estado, @destacado, @orden)
  `);

  const cursos = [
    {
      slug: "fundamentos-de-inteligencia-artificial",
      titulo: "Fundamentos de Inteligencia Artificial",
      categoria: "tecnologia",
      descripcion: "Introducción práctica al uso responsable de herramientas y conceptos de IA.",
      estudiantes: 98,
      nivel: "Básico",
      duracion_horas: 30,
      modalidad: "Híbrida",
      imagen: "/images/courses/fundamentos-ia.webp",
      imagen_alt: "Manos escribiendo en una laptop con íconos digitales flotando",
      estado: "activo",
      destacado: 1,
      orden: 1,
    },
    {
      slug: "marketing-digital-estrategico",
      titulo: "Marketing Digital Estratégico",
      categoria: "negocios",
      descripcion: "Diseña campañas, contenidos y métricas con enfoque en resultados.",
      estudiantes: 145,
      nivel: "Intermedio",
      duracion_horas: 25,
      modalidad: "Virtual",
      imagen: "/images/courses/marketing-digital.jpg",
      imagen_alt: "Escritorio con laptop y diagramas de estrategia de marketing",
      estado: "activo",
      destacado: 0,
      orden: 2,
    },
    {
      slug: "liderazgo-y-gestion-de-equipos",
      titulo: "Liderazgo y Gestión de Equipos",
      categoria: "habilidades",
      descripcion: "Fortalece comunicación, liderazgo y coordinación de equipos de trabajo.",
      estudiantes: 76,
      nivel: "Intermedio",
      duracion_horas: 20,
      modalidad: "Presencial",
      imagen: "/images/courses/liderazgo-equipos.webp",
      imagen_alt: "Equipo de trabajo reunido alrededor de una mesa",
      estado: "activo",
      destacado: 0,
      orden: 3,
    },
    {
      slug: "ciberseguridad-para-organizaciones",
      titulo: "Ciberseguridad para Organizaciones",
      categoria: "tecnologia",
      descripcion: "Buenas prácticas para reducir riesgos y proteger información institucional.",
      estudiantes: null,
      nivel: "Avanzado",
      duracion_horas: 35,
      modalidad: null,
      imagen: "/images/courses/ciberseguridad.webp",
      imagen_alt: "Candado digital rodeado de íconos de servicios en línea",
      estado: "proximamente",
      destacado: 0,
      orden: 4,
    },
  ];

  transaction(db, () => cursos.forEach((c) => insert.run(c)));
  console.log("[db] cursos iniciales creados");
}
