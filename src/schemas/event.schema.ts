
import { z } from "zod";
import {
  EVENT_TYPES,
  EVENT_MODALITIES,
  EVENT_STATUSES,
} from "@/types/event.types";

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() === ""
    ? undefined
    : value;

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(150, "El título no puede pasar de 150 caracteres."),

  slug: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres.")
    .max(100, "La dirección es demasiado larga.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Usa solo minúsculas, números y guiones.",
    ),

  type: z.enum(EVENT_TYPES, {
    message: "Selecciona un tipo de evento.",
  }),

  modality: z.enum(EVENT_MODALITIES, {
    message: "Selecciona una modalidad.",
  }),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "La fecha no existe."),

  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Selecciona una hora válida.",
    ),

  location: z.preprocess(
    optionalText,
    z.string().trim().max(150, "Máximo 150 caracteres.").optional(),
  ),

  price: z.preprocess(
    optionalText,
    z.union([
      z.undefined(),
      z.coerce.number().finite().min(0, "El costo no puede ser negativo."),
    ]),
  ),

  capacity: z.preprocess(
    optionalText,
    z.union([
      z.undefined(),
      z.coerce
        .number()
        .int("Los cupos deben ser un número entero.")
        .min(1, "Debe haber al menos un cupo."),
    ]),
  ),

  registrationUrl: z.preprocess(
    optionalText,
    z.union([
      z.undefined(),
      z.string().trim().url("Ingresa un enlace válido."),
    ]),
  ),

  status: z.enum(EVENT_STATUSES, {
    message: "Selecciona un estado.",
  }),

  description: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres.")
    .max(1000, "La descripción no puede pasar de 1000 caracteres."),

  image: z.string().trim().min(1, "Sube una imagen para el evento."),

  imageAlt: z
    .string()
    .trim()
    .min(5, "Describe brevemente la imagen.")
    .max(200, "Máximo 200 caracteres."),

  visible: z.boolean(),
  featured: z.boolean(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type EventFormField = keyof EventInput;
