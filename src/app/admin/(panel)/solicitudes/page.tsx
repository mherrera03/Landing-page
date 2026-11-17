import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/leads.repository";
import { getSettings } from "@/server/database/repositories/settings.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { LeadList } from "@/components/admin/leads/LeadList";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Solicitudes" };

const MENSAJES = {
  eliminado: "Solicitud eliminada correctamente.",
};

const FILTROS = [
  { id: "pendientes", label: "Pendientes" },
  { id: "atendidas", label: "Atendidas" },
  { id: "todas", label: "Todas" },
] as const;

type Filtro = (typeof FILTROS)[number]["id"];

export default async function SolicitudesPage({ searchParams }: PageProps<"/admin/solicitudes">) {
  await requireSession();
  const params = await searchParams;

  const filtro: Filtro = FILTROS.find((f) => f.id === params.estado)?.id ?? "pendientes";

  const todas = await repo.findAll();
  const pendientes = todas.filter((lead) => !lead.attended);
  const leads = filtro === "todas" ? todas : filtro === "pendientes" ? pendientes : todas.filter((lead) => lead.attended);

  return (
    <>
      <PageHeader title="Solicitudes" description="Mensajes que llegan desde el formulario de contacto de la landing." />

      <FlashFromParams params={params} messages={MENSAJES} />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTROS.map(({ id, label }) => {
          const activo = filtro === id;

          return (
            <Link
              key={id}
              href={`/admin/solicitudes?estado=${id}`}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200",
                activo ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:bg-paper",
              )}
            >
              {label}
              {id === "pendientes" && pendientes.length > 0 && (
                <span className={cn("rounded-full px-1.5 text-xs font-bold", activo ? "bg-white/20" : "bg-violet-soft text-violet-deep")}>
                  {pendientes.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <LeadList leads={leads} contactEmail={(await getSettings()).email} />
    </>
  );
}
