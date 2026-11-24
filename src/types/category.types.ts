/**
 * Categoría de curso. Antes eran tres valores fijos en el código; ahora son
 * filas que el panel crea y edita.
 */
export type Category = {
  id: number;
  /**
   * Lo que guarda cada curso en `cursos.categoria` y lo que viaja en el filtro
   * de la landing: "tecnologia". Se genera del nombre al crearla y **no se
   * edita nunca** — es lo que hace que renombrar una categoría sea inofensivo.
   */
  key: string;
  /** El nombre visible, "Tecnología". Es lo único que se renombra. */
  name: string;
  /** Los números más bajos salen primero. */
  order: number;
  updatedAt: string;
};
