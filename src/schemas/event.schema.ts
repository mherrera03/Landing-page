import { z } from "zod";
import { EVENT_TYPES, EVENT_MODALITIES, EVENT_STATUSES } from "@/types/event.types";
import { httpUrl, isRealDate, localImage, slugField } from "./shared";

/** Un campo opcional que llega vacío del formulario cuenta como "sin valor". */
const emptyToUndefined = (value: unknown) => (typeof value === "string" && value.trim() === "" ? undefined : value);

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(150, "El título no puede pasar de 150 caracteres."),
  slug: slugField,
  type: z.enum(EVENT_TYPES, "Selecciona un tipo de evento."),
  modality: z.enum(EVENT_MODALITIES, "Selecciona una modalidad."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida.")
    .refine(isRealDate, "La fecha no existe."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Selecciona una hora válida."),
  location: z.preprocess(emptyToUndefined, z.string().trim().max(150, "Máximo 150 caracteres.").optional()),
  price: z.preprocess(emptyToUndefined, z.coerce.number().min(0, "El costo no puede ser negativo.").optional()),
  capacity: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int("Los cupos deben ser un número entero.").min(1, "Debe haber al menos un cupo.").optional(),
  ),
  registrationUrl: z.preprocess(emptyToUndefined, z.string().trim().pipe(httpUrl).optional()),
  status: z.enum(EVENT_STATUSES, "Selecciona un estado."),
  description: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres.")
    .max(1000, "La descripción no puede pasar de 1000 caracteres."),
  image: localImage("Sube una imagen para el evento."),
  imageAlt: z.string().trim().min(5, "Describe brevemente la imagen.").max(200, "Máximo 200 caracteres."),
  visible: z.boolean(),
  featured: z.boolean(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type EventFormField = keyof EventInput;
