/** Une clases condicionales: cn("a", cond && "b") -> "a b" */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
