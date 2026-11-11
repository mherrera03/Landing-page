import Link from "next/link";
import type { Publication, PublicationKind } from "@/types/publication.types";
import { togglePublicationAction } from "@/server/actions/publications.actions";
import { DeletePublicationButton } from "./DeletePublicationButton";
import { nowInElSalvador } from "@/lib/dates";

export function PublicationList({ kind, items }: { kind: PublicationKind; items: Publication[] }) {
  const path = kind === "noticia" ? "noticias" : "anuncios";
  const toggle = togglePublicationAction.bind(null, kind);
  const now = nowInElSalvador();
  const status = (item: Publication) => {
    if (!item.visible) return "Oculto";
    if (kind === "anuncio" && item.startsAt && item.startsAt > now) return "Programado";
    if (kind === "anuncio" && item.endsAt && item.endsAt < now) return "Vencido";
    return "Publicado";
  };

  if (!items.length) return <p className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">Todavía no hay {path}. Crea el primero.</p>;
  return <ul className="space-y-3">{items.map((item) => <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
    <div className="min-w-0 flex-1"><h2 className="font-bold text-ink">{item.title}</h2><p className="line-clamp-1 text-sm text-muted">{item.summary}</p><p className="mt-1 text-xs text-muted">{status(item)} · {item.createdAt.slice(0, 10)}{item.startsAt && ` · Desde ${item.startsAt.replace("T", " ")}`}{item.endsAt && ` · Hasta ${item.endsAt.replace("T", " ")}`}</p></div>
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/${path}/${item.id}/editar`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-ink">Editar</Link>
      <form action={toggle}><input type="hidden" name="id" value={item.id} /><button className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold text-ink">{item.visible ? "Ocultar" : "Publicar"}</button></form>
      <DeletePublicationButton kind={kind} id={item.id} title={item.title} />
    </div>
  </li>)}</ul>;
}
