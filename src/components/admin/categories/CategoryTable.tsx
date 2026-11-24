import type { Category } from "@/types/category.types";
import { EditLink, EmptyState, ListRow, Pill } from "../ui/ListItems";

type CategoryTableProps = {
  categories: Category[];
  /** Cuántos cursos usa cada categoría, por clave. */
  courseCounts: Record<string, number>;
};

export function CategoryTable({ categories, courseCounts }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <EmptyState title="Todavía no hay categorías" action={{ href: "/admin/categorias/nueva", label: "Agregar categoría" }}>
        Sin categorías no se pueden crear cursos. Agrega al menos una.
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-3">
      {categories.map((categoria) => {
        const cursos = courseCounts[categoria.key] ?? 0;

        return (
          <ListRow key={categoria.id}>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-ink">{categoria.name}</h2>
                {/* La clave se enseña para que se entienda que no cambia al renombrar. */}
                <Pill>{categoria.key}</Pill>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>Posición {categoria.order}</span>
                <span>
                  {cursos === 0 ? "Sin cursos" : cursos === 1 ? "1 curso" : `${cursos} cursos`}
                </span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <EditLink href={`/admin/categorias/${categoria.id}/editar`} title={categoria.name} />
            </div>
          </ListRow>
        );
      })}
    </ul>
  );
}
