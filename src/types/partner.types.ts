/** Grupos en los que se reparten los logos de la sección "Alianzas". */
export const PARTNER_GROUPS = ["instituciones", "empresas"] as const;

export type PartnerGroup = (typeof PARTNER_GROUPS)[number];

/** Título que se ve en la landing sobre cada grupo de logos. */
export const PARTNER_GROUP_LABELS: Record<PartnerGroup, string> = {
  instituciones: "Principales instituciones aliadas",
  empresas: "Empresas y organizaciones socias",
};

export type Partner = {
  id: number;
  name: string;
  /** Ruta del logo: /images/… en local o URL de Vercel Blob en producción. */
  logo: string;
  /** Página web de la institución. Vacío si no tiene. */
  url: string;
  group: PartnerGroup;
  /** Los números más bajos salen primero dentro de su grupo. */
  order: number;
  visible: boolean;
  updatedAt: string;
};
