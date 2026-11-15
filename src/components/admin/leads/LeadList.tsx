import type { ReactNode } from "react";
import { Check, Globe, Mail, MessageCircle, Phone, RotateCcw, Tag, type LucideIcon } from "lucide-react";
import { toggleLeadAttendedAction } from "@/server/actions/leads.actions";
import { formatDateTime } from "@/lib/dates";
import { leadMailto } from "@/lib/lead-email";
import type { Lead } from "@/types/lead.types";
import { cn } from "@/lib/utils";
import { EmptyState, Pill, rowButton } from "../ui/ListItems";
import { DeleteLeadButton } from "./DeleteLeadButton";

/** wa.me solo acepta dígitos: se quitan el +, los espacios y los guiones. */
function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

type LeadListProps = {
  leads: Lead[];
  /** Correo público del sitio: firma las respuestas que se abren desde aquí. */
  contactEmail: string;
};

export function LeadList({ leads, contactEmail }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <EmptyState title="No hay solicitudes aquí">
        Las que lleguen desde el formulario de la landing aparecerán en esta lista.
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-3">
      {leads.map((lead) => (
        <li
          key={lead.id}
          className={cn(
            "rounded-2xl border bg-surface p-5",
            lead.attended ? "border-line opacity-75" : "border-violet/30 shadow-soft",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-ink">{lead.name}</h2>
                {lead.attended ? <Pill icon={Check}>Atendida</Pill> : <Pill accent>Pendiente</Pill>}
              </div>
              <p className="mt-0.5 text-sm text-muted">{formatDateTime(lead.createdAt)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <form action={toggleLeadAttendedAction}>
                <input type="hidden" name="id" value={lead.id} />
                <button type="submit" className={rowButton}>
                  {lead.attended ? (
                    <RotateCcw className="size-4" aria-hidden="true" />
                  ) : (
                    <Check className="size-4" aria-hidden="true" />
                  )}
                  {lead.attended ? "Reabrir" : "Marcar atendida"} <span className="sr-only">la solicitud de {lead.name}</span>
                </button>
              </form>

              <DeleteLeadButton id={lead.id} nombre={lead.name} />
            </div>
          </div>

          {/* Datos de contacto: correo y teléfono son enlaces para responder de una vez */}
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Dato icon={Mail} label="Correo">
              <a href={leadMailto(lead, contactEmail)} className="font-medium text-violet-deep underline-offset-4 hover:underline">
                {lead.email}
              </a>
            </Dato>

            {lead.phone && (
              <Dato icon={Phone} label="Teléfono">
                <a
                  href={whatsappLink(lead.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-violet-deep underline-offset-4 hover:underline"
                >
                  {lead.phone}
                  <MessageCircle className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(abrir WhatsApp en una pestaña nueva)</span>
                </a>
              </Dato>
            )}

            {lead.country && (
              <Dato icon={Globe} label="País">
                <span className="font-medium text-ink">{lead.country}</span>
              </Dato>
            )}

            {lead.interest && (
              <Dato icon={Tag} label="Le interesa">
                <span className="font-medium text-ink">{lead.interest}</span>
              </Dato>
            )}
          </dl>

          {lead.message && (
            <blockquote className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-ink">
              {lead.message}
            </blockquote>
          )}
        </li>
      ))}
    </ul>
  );
}

function Dato({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="truncate">{children}</dd>
      </div>
    </div>
  );
}
