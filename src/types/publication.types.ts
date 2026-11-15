export type PublicationKind = "noticia" | "anuncio";

/** Segmento de la URL de cada tipo: /noticias, /admin/anuncios… */
export const PUBLICATION_PATHS: Record<PublicationKind, string> = {
  noticia: "noticias",
  anuncio: "anuncios",
};

export type Publication = {
  id: number;
  kind: PublicationKind;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  imageAlt: string;
  link: string;
  startsAt: string;
  endsAt: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};
