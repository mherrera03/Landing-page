import { z } from "zod";
import { USER_ROLES } from "@/types/user.types";

/** Mínimo razonable sin volverlo incómodo: lo que importa es que no sea "1234". */
const MIN_PASSWORD = 8;

const password = z
  .string()
  .min(MIN_PASSWORD, `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`)
  .max(72, "La contraseña es demasiado larga.");

const base = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Escribe el nombre completo.")
    .max(80, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Escribe un correo válido."))
    .pipe(z.string().max(120, "El correo es demasiado largo.")),
  role: z.enum(USER_ROLES, "Selecciona un rol."),
  active: z.coerce.boolean<boolean>(),
});

/** Al crear, la contraseña es obligatoria: sin ella la cuenta no podría entrar. */
export const createUserSchema = base.extend({ password });

/** Al editar, se deja vacía para conservar la contraseña actual. */
export const updateUserSchema = base.extend({
  password: z.union([z.literal(""), password]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFormField = keyof UpdateUserInput;
