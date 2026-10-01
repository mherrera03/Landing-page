import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Panel administrativo", template: "%s · Admin UGB Plus" },
  robots: { index: false, follow: false },
};

/**
 * Este layout solo aporta los metadatos del admin.
 * El menú lateral vive en (panel)/layout.tsx para que el login no lo tenga.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
