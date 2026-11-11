export type PublicationKind = "noticia" | "anuncio";

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
