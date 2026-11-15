import "server-only";
import { z } from "zod";
import type { FormState } from "@/types/form.types";
import { saveImage, type SaveImageResult, type UploadFolder } from "./storage/uploads";

/**
 * Lo que todas las acciones de formulario del panel hacen igual: leer los
 * campos, guardar la imagen si subieron una, validar con Zod y, si algo falla,
 * devolver los errores junto con lo que la persona había escrito.
 */

/**
 * Campos de texto del formulario. Los archivos se leen aparte, y los campos
 * internos que React añade para localizar la acción ($ACTION_…) se descartan.
 */
function textValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) values[key] = value;
  }
  return values;
}

/** Primer mensaje de error de cada campo, listo para pintarlo junto a él. */
export function fieldErrors<Field extends string>(error: z.ZodError): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  for (const [field, messages] of Object.entries(z.flattenError(error).fieldErrors)) {
    const [first] = (messages as string[] | undefined) ?? [];
    if (first) errors[field as Field] = first;
  }
  return errors;
}

/** id que viaja en un campo oculto. null si no es un entero positivo. */
export function readId(formData: FormData, field = "id"): number | null {
  const id = Number(formData.get(field));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

type ImageField = {
  folder: UploadFolder;
  /** Campo con el archivo recién subido. */
  fileField?: string;
  /** Campo oculto con la ruta de la imagen que ya estaba guardada. */
  pathField?: string;
};

/**
 * Imagen de un formulario: si subieron un archivo, se guarda y reemplaza a la
 * anterior; si no, se conserva la ruta que ya había.
 *
 * Se comprueba contra Blob (File lo extiende): según el runtime, el archivo
 * subido no siempre es exactamente la clase File.
 */
async function resolveImage(formData: FormData, fileField: string, pathField: string, folder: UploadFolder): Promise<SaveImageResult> {
  const file = formData.get(fileField);
  if (file instanceof Blob && file.size > 0) return saveImage(file, folder);
  return { ok: true, path: String(formData.get(pathField) ?? "") };
}

type ParseOptions = {
  /** Interruptores (Switch): envían "on" cuando están activos y se convierten a booleano. */
  switches?: string[];
  /** Imágenes que puede traer el formulario. */
  images?: ImageField[];
  /** Campos que nunca se devuelven al formulario, como la contraseña. */
  secrets?: string[];
};

/** Nombres de los campos del esquema: los que pueden traer un error propio. */
type FieldOf<Schema extends z.ZodType> = Extract<keyof z.output<Schema>, string>;

type Parsed<Schema extends z.ZodType> =
  | { ok: true; data: z.output<Schema>; values: Record<string, string> }
  | { ok: false; state: FormState<FieldOf<Schema>> };

/**
 * Convierte el formulario en datos validados.
 * Si algo falla devuelve `state`, listo para que la acción lo retorne tal cual.
 */
export async function parseForm<Schema extends z.ZodType>(
  formData: FormData,
  schema: Schema,
  { switches = [], images = [], secrets = [] }: ParseOptions = {},
): Promise<Parsed<Schema>> {
  const input = textValues(formData);

  // `values` es lo que vuelve al formulario si hay que repintarlo
  const values = { ...input };
  for (const field of secrets) delete values[field];

  for (const { folder, fileField = "imagenArchivo", pathField = "image" } of images) {
    const image = await resolveImage(formData, fileField, pathField, folder);
    if (!image.ok) {
      const fields = { [pathField]: image.error } as Partial<Record<FieldOf<Schema>, string>>;
      return { ok: false, state: { values, fields } };
    }
    // La imagen ya quedó guardada: aunque falle otro campo, no hay que volver a subirla
    input[pathField] = values[pathField] = image.path;
  }

  const flags = Object.fromEntries(switches.map((name) => [name, formData.get(name) === "on"]));
  const result = schema.safeParse({ ...input, ...flags });

  if (!result.success) return { ok: false, state: { values, fields: fieldErrors(result.error) } };
  return { ok: true, data: result.data, values };
}
