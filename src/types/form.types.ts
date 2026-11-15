/**
 * Lo que una acción de formulario devuelve a `useActionState`.
 * `Field` son los nombres de los campos que pueden traer un error propio.
 */
export type FormState<Field extends string = string> = {
  /** Error general, que no pertenece a un campo concreto. */
  error?: string;
  /** Mensaje de error por campo. */
  fields?: Partial<Record<Field, string>>;
  /** Lo que se había escrito, para no perderlo si hay un error. */
  values?: Record<string, string>;
  /** Se guardó bien (formularios que se quedan en la misma página). */
  saved?: boolean;
};
