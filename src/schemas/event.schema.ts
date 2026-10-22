import { z } from "zod";
import { EVENT_MODALITIES, EVENT_STATUSES, EVENT_TYPES } from "@/types/event.types";

// Los campos opcionales llegan como "" desde el formulario
const vacioAUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(150, "El título no puede pasar de 150 caracteres"),
  slug: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .max(100, "La dirección es demasiado larga")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones"),
  type: z.enum(EVENT_TYPES, { message: "Selecciona un tipo de evento" }),
  modality: z.enum(EVENT_MODALITIES, { message: "Selecciona una modalidad" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora válida"),
  location: z.preprocess(vacioAUndefined, z.string().trim().max(150, "Máximo 150 caracteres").optional()),
  price: z.preprocess(
    vacioAUndefined,
    z.coerce.number({ message: "Ingresa un número válido" }).min(0, "El costo no puede ser negativo").optional(),
  ),
  capacity: z.preprocess(
    vacioAUndefined,
    z.coerce
      .number({ message: "Ingresa un número válido" })
      .int("Debe ser un número entero")
      .min(1, "Debe haber al menos 1 cupo")
      .optional(),
  ),
  registrationUrl: z.preprocess(
    vacioAUndefined,
    z.string().trim().url("Ingresa un enlace válido (https://...)").optional(),
  ),
  status: z.enum(EVENT_STATUSES, { message: "Selecciona un estado" }),
  description: z
    .string()
    .trim()
    .min(20, "Cuenta un poco más del evento (mínimo 20 caracteres)")
    .max(1000, "La descripción no puede pasar de 1000 caracteres"),
  image: z.string().trim().min(1, "Sube una imagen para el evento"),
  imageAlt: z
    .string()
    .trim()
    .min(5, "Describe brevemente la imagen")
    .max(200, "Máximo 200 caracteres"),
  visible: z.boolean(),
  featured: z.boolean(),
});

export type EventInput = z.infer<typeof eventSchema>;
