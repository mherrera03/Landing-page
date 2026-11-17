import "server-only";
import type { Client, InValue, Transaction } from "@libsql/client";
import { hashPassword } from "../../auth/password";

const SEEDS: { tabla: string; sembrar: (tx: Transaction) => Promise<void> }[] = [
  { tabla: "usuarios", sembrar: seedUsuarios },
  { tabla: "cursos", sembrar: seedCursos },
  { tabla: "events", sembrar: seedEventos },
];

/**
 * Datos iniciales. Solo se insertan si la tabla está vacía,
 * así nunca pisa lo que el admin haya creado.
 */
export async function seed(db: Client) {
  for (const { tabla, sembrar } of SEEDS) {
    // Lo normal: ya hay datos y no hace falta pedir el turno de escritura
    if (!(await estaVacia(db, tabla))) continue;

    const tx = await db.transaction("write");
    try {
      // Se vuelve a mirar ya dentro de la transacción: al compilar, otro proceso
      // pudo sembrar la tabla mientras este esperaba, y saldría todo duplicado.
      const { rows } = await tx.execute(`SELECT COUNT(*) AS n FROM ${tabla}`);
      // Las inserciones van por `tx`: con el cliente suelto chocarían contra
      // el bloqueo de escritura que esta misma transacción ya tiene tomado.
      if (Number(rows[0].n) === 0) await sembrar(tx);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}

async function estaVacia(db: Client, tabla: string): Promise<boolean> {
  const { rows } = await db.execute(`SELECT COUNT(*) AS n FROM ${tabla}`);
  return Number(rows[0].n) === 0;
}

/**
 * La primera cuenta del panel. En producción se define con ADMIN_EMAIL y
 * ADMIN_PASSWORD; si faltan, no se crea ninguna cuenta y hay que insertarla
 * a mano. En desarrollo caen a unas credenciales de prueba para que el equipo
 * pueda entrar recién clonado el proyecto.
 */
function credencialesIniciales(): { correo: string; contrasena: string } | null {
  const correo = process.env.ADMIN_EMAIL;
  const contrasena = process.env.ADMIN_PASSWORD;

  if (correo && contrasena) return { correo, contrasena };

  if (process.env.NODE_ENV === "production") {
    console.warn("[db] sin ADMIN_EMAIL y ADMIN_PASSWORD no se crea la cuenta inicial del panel");
    return null;
  }

  return { correo: "admin@ugb.edu.sv", contrasena: "admin123" };
}

async function seedUsuarios(tx: Transaction) {
  const credenciales = credencialesIniciales();
  if (!credenciales) return;

  await tx.execute({
    sql: "INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)",
    args: ["Administrador", credenciales.correo, hashPassword(credenciales.contrasena), "admin"],
  });
  console.log(`[db] usuario inicial creado: ${credenciales.correo}`);
}

async function seedCursos(tx: Transaction) {
  const sql = `
    INSERT INTO cursos (slug, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas,
                        modalidad, imagen, imagen_alt, estado, destacado, orden)
    VALUES (@slug, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas,
            @modalidad, @imagen, @imagen_alt, @estado, @destacado, @orden)
  `;

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

  for (const curso of cursos) await tx.execute({ sql, args: curso as Record<string, InValue> });
  console.log("[db] cursos iniciales creados");
}

/**
 * Un evento de ejemplo: así una copia recién clonada del proyecto no muestra
 * la sección de eventos en blanco.
 */
async function seedEventos(tx: Transaction) {
  const sql = `
    INSERT INTO events (slug, title, type, modality, event_date, event_time, location, price, registration_url,
                        status, description, image, image_alt, visible, featured, created_at, updated_at)
    VALUES (@slug, @title, @type, @modality, @event_date, @event_time, @location, @price, @registration_url,
            @status, @description, @image, @image_alt, 1, 1, @now, @now)
  `;

  await tx.execute({ sql, args: {
    slug: "masterclass-interiorismo-2027",
    title: "Adiós al minimalismo frío: así será el interiorismo en 2027",
    type: "Masterclass",
    modality: "Virtual",
    event_date: "2026-10-08",
    event_time: "19:00",
    location: "En línea",
    price: 0,
    registration_url: "https://forms.cloud.microsoft/r/uLt18RQCVQ",
    status: "finalizado",
    description:
      "Una sesión gratuita para conocer hacia dónde van las tendencias de interiorismo y cómo aplicarlas en tus propios proyectos.",
    image: "/images/events/masterclass-interiorismo-2027.jpg",
    image_alt:
      "Masterclass gratis «Adiós al minimalismo frío: así será el interiorismo en 2027», el jueves 8 de octubre de 2026 a las 7:00 p. m.",
    now: new Date().toISOString(),
  } });
  console.log("[db] evento de ejemplo creado");
}
