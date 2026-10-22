export const USER_ROLES = ["admin", "editor"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
};

/** Qué puede hacer cada rol, para explicarlo en el formulario. */
export const USER_ROLE_HINTS: Record<UserRole, string> = {
  admin: "Administra todo el panel, incluidos los usuarios.",
  editor: "Administra cursos, eventos y banners, pero no los usuarios.",
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};
