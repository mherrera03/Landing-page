import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Eye, EyeOff, Plus, Sparkles } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as coursesRepo from "@/server/database/repositories/courses.repository";
import * as eventsRepo from "@/server/database/repositories/events.repository";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { Button } from "@/components/ui/Button";

/** Cuántos cursos caben en "Últimos cursos"; el resto, en "Ver todos". */
const RECIENTES = 5;

export default async function DashboardPage() {
  const session = await requireSession();
  const cursos = await coursesRepo.countAll();
  const eventos = await eventsRepo.countAll();
  const recientes = await coursesRepo.findRecent(RECIENTES);
  const ocultos = cursos.total - cursos.visibles + (eventos.total - eventos.visibles);

  return (
    <>
      <section className="relative mb-8 overflow-hidden rounded-[1.5rem] bg-ink p-6 text-white shadow-lift sm:p-8">
        <span aria-hidden="true" className="absolute -top-24 -right-16 size-72 rounded-full bg-[#c471ed]/45 blur-3xl" />
        <span aria-hidden="true" className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-[#12c2e9]/30 blur-3xl" />
        <span aria-hidden="true" className="absolute top-6 right-1/3 size-40 rounded-full bg-[#f64f59]/25 blur-3xl" />
        <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-1" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Resumen del panel
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hola,{" "}
              <span className="text-gradient" style={{ backgroundImage: "var(--grad)" }}>
                {session.name.split(" ")[0]}
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
              Desde aquí administras el contenido que ve la gente en la landing.
            </p>
          </div>
          <Button href="/admin/cursos/nuevo" variant="gradient" className="shrink-0">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo curso
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Cursos en total" value={cursos.total} accent="violet" />
        <StatCard icon={Eye} label="Cursos visibles" value={cursos.visibles} accent="cyan" />
        <StatCard icon={CalendarDays} label="Eventos en total" value={eventos.total} accent="coral" />
        <StatCard icon={EyeOff} label="Ocultos (cursos y eventos)" value={ocultos} accent="ink" />
      </div>

      <section className="admin-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2.5 font-bold text-ink">
            <span aria-hidden="true" className="bg-brand size-2 rounded-full" />
            Últimos cursos
          </h2>
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
                <Link href={`/admin/cursos/${curso.id}/editar`} className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-violet-soft/60">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{curso.title}</span>
                    <span className="text-xs text-muted">Actualizado el {curso.updatedAt.slice(0, 10)}</span>
                  </span>
                  {!curso.visible && (
                    <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">Oculto</span>
                  )}
                  <ArrowRight className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-deep" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
