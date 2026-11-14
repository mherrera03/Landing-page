import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/leads.repository";
import { getSettings } from "@/server/database/repositories/settings.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { LeadList } from "@/components/admin/leads/LeadList";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Solicitudes",
};

const FILTROS = [
  { id: "pendientes", label: "Pendientes" },
  { id: "atendidas", label: "Atendidas" },
  { id: "todas", label: "Todas" },
] as const;

type Filtro = (typeof FILTROS)[number]["id"];

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SolicitudesPage({ searchParams }: PageProps) {
  await requireSession();
  const params = await searchParams;

  const filtro: Filtro = FILTROS.some((f) => f.id === params.estado) ? (params.estado as Filtro) : "pendientes";

  const todas = repo.findAll();
  const leads = todas.filter((lead) =>
    filtro === "todas" ? true : filtro === "pendientes" ? !lead.attended : lead.attended,
  );

  const pendientes = todas.filter((l) => !l.attended).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitudes"
        description="Mensajes que llegan desde el formulario de contacto de la landing."
      />

      {params.eliminado === "1" && <FlashMessage>Solicitud eliminada correctamente.</FlashMessage>}

      <div className="flex flex-wrap gap-2">
        {FILTROS.map(({ id, label }) => (
          <Link
            key={id}
            href={`/admin/solicitudes?estado=${id}`}
            aria-current={filtro === id ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200",
              filtro === id ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:bg-paper",
            )}
          >
            {label}
            {id === "pendientes" && pendientes > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-bold",
                  filtro === id ? "bg-white/20" : "bg-violet-soft text-violet-deep",
                )}
              >
                {pendientes}
              </span>
            )}
          </Link>
        ))}
      </div>

      <LeadList leads={leads} contactEmail={getSettings().email} />
    </div>
  );
}
