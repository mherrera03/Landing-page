import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { togglePartnerVisibilityAction } from "@/server/actions/partners.actions";
import { PARTNER_GROUP_LABELS, PARTNER_GROUPS, type Partner } from "@/types/partner.types";
import { EditLink, EmptyState, ListRow, Pill, VisibilityToggle } from "../ui/ListItems";

/** Miniatura del logo: entera y sobre blanco, como se ve en la landing. */
function LogoThumbnail({ src }: { src: string }) {
  return (
    <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:w-32">
      <Image src={src} alt="" fill sizes="128px" className="object-contain p-2" />
    </div>
  );
}

/** Aliados agrupados igual que en la landing. */
export function PartnerTable({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) {
    return (
      <EmptyState title="Todavía no hay aliados" action={{ href: "/admin/aliados/nuevo", label: "Agregar aliado" }}>
        Agrega el primero y su logo aparecerá en la sección Alianzas de la landing.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-8">
      {PARTNER_GROUPS.map((group) => {
        const items = partners.filter((partner) => partner.group === group);
        if (items.length === 0) return null;

        return (
          <section key={group} aria-labelledby={`grupo-${group}`}>
            <h2 id={`grupo-${group}`} className="mb-3 flex items-center gap-2.5 font-bold text-ink">
              <span aria-hidden="true" className="bg-brand size-2 rounded-full" />
              {PARTNER_GROUP_LABELS[group]}
              <span className="text-sm font-medium text-muted">({items.length})</span>
            </h2>

            <ul className="grid gap-3">
              {items.map((partner) => (
                <ListRow key={partner.id} dimmed={!partner.visible}>
                  <LogoThumbnail src={partner.logo} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-ink">{partner.name}</h3>
                      {!partner.visible && <Pill>Oculto</Pill>}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span>Posición {partner.order}</span>
                      {partner.url && (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-w-0 items-center gap-1 font-medium text-violet-deep hover:underline"
                        >
                          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{partner.url.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <VisibilityToggle
                      action={togglePartnerVisibilityAction}
                      id={partner.id}
                      visible={partner.visible}
                      title={partner.name}
                    />
                    <EditLink href={`/admin/aliados/${partner.id}/editar`} title={partner.name} />
                  </div>
                </ListRow>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
