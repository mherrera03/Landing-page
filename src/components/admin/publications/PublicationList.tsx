import { nowInElSalvador } from "@/lib/dates";
import { togglePublicationAction } from "@/server/actions/publications.actions";
import { PUBLICATION_PATHS, type Publication, type PublicationKind } from "@/types/publication.types";
import { EditLink, EmptyState, ListRow, Pill, VisibilityToggle } from "../ui/ListItems";
import { DeletePublicationButton } from "./DeletePublicationButton";

/** "2026-11-15T14:30" -> "2026-11-15 14:30" */
const readable = (dateTime: string) => dateTime.replace("T", " ");

/** Un anuncio publicado puede no estar a la vista todavía (o ya no) según su horario. */
function scheduleLabel(item: Publication, now: string): string | null {
  if (item.startsAt && item.startsAt > now) return "Programado";
  if (item.endsAt && item.endsAt < now) return "Vencido";
  return null;
}

export function PublicationList({ kind, items }: { kind: PublicationKind; items: Publication[] }) {
  const path = PUBLICATION_PATHS[kind];

  if (items.length === 0) {
    return (
      <EmptyState
        title={`Todavía no hay ${path}`}
        action={{ href: `/admin/${path}/nuevo`, label: kind === "noticia" ? "Crear noticia" : "Crear anuncio" }}
      >
        Lo que publiques aquí aparecerá en el sitio público.
      </EmptyState>
    );
  }

  const toggle = togglePublicationAction.bind(null, kind);
  const now = nowInElSalvador();

  return (
    <ul className="grid gap-3">
      {items.map((item) => {
        const schedule = scheduleLabel(item, now);

        return (
          <ListRow key={item.id} dimmed={!item.visible}>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-ink">{item.title}</h2>
                {!item.visible && <Pill>Oculto</Pill>}
                {item.visible && schedule && <Pill>{schedule}</Pill>}
              </div>
              <p className="mt-0.5 line-clamp-1 text-sm text-muted">{item.summary}</p>
              <p className="mt-1 text-xs text-muted">
                Creado el {item.createdAt.slice(0, 10)}
                {item.startsAt && ` · Desde ${readable(item.startsAt)}`}
                {item.endsAt && ` · Hasta ${readable(item.endsAt)}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <VisibilityToggle action={toggle} id={item.id} visible={item.visible} title={item.title} />
              <EditLink href={`/admin/${path}/${item.id}/editar`} title={item.title} />
              <DeletePublicationButton kind={kind} id={item.id} title={item.title} />
            </div>
          </ListRow>
        );
      })}
    </ul>
  );
}
