import { deletePublicationAction } from "@/server/actions/publications.actions";
import type { PublicationKind } from "@/types/publication.types";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeletePublicationButton({ kind, id, title }: { kind: PublicationKind; id: number; title: string }) {
  return (
    <ConfirmDeleteButton
      action={deletePublicationAction.bind(null, kind)}
      id={id}
      label={`Eliminar ${title}`}
      iconOnly
      question={kind === "noticia" ? "¿Eliminar esta noticia?" : "¿Eliminar este anuncio?"}
      alternative={<>Si solo quieres quitarlo de la vista, ocúltalo en lugar de eliminarlo.</>}
    >
      Se borrará <strong className="text-ink">{title}</strong> de forma permanente. Esta acción no se puede deshacer.
    </ConfirmDeleteButton>
  );
}
