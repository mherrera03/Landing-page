import Link from "next/link";
import { BookOpen, Eye, EyeOff, Clock, Plus, ArrowRight } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/courses.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await requireSession();
  const { total, visibles, proximamente } = repo.countAll();
  const recientes = repo.findAll().slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Hola, ${session.name.split(" ")[0]}`}
        description="Desde aquí administras el contenido que ve la gente en la landing."
        action={
          <Button href="/admin/cursos/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo curso
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Cursos en total" value={total} />
        <StatCard icon={Eye} label="Visibles en la landing" value={visibles} />
        <StatCard icon={EyeOff} label="Ocultos" value={total - visibles} />
        <StatCard icon={Clock} label="Próximamente" value={proximamente} />
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-bold text-ink">Últimos cursos</h2>
          <Link href="/admin/cursos" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-violet-deep">
            Ver todos
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {recientes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Todavía no hay cursos. Crea el primero.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recientes.map((curso) => (
              <li key={curso.id}>
                <Link href={`/admin/cursos/${curso.id}/editar`} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-paper">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{curso.title}</span>
                    <span className="text-xs text-muted">Actualizado el {curso.updatedAt.slice(0, 10)}</span>
                  </span>
                  {!curso.visible && (
                    <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">Oculto</span>
                  )}
                  <ArrowRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
