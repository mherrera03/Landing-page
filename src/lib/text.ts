/** Longitud máxima de una dirección web ("slug"). */
export const SLUG_MAX = 100;

/** Quita tildes y diéresis: "Panamá" -> "Panama". */
export function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** "Fundamentos de IA" -> "fundamentos-de-ia" */
export function slugify(text: string): string {
  return stripAccents(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, SLUG_MAX)
    .replace(/^-+|-+$/g, "");
}
