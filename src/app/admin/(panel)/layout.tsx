import type { ReactNode } from "react";
import { requireSession } from "@/server/auth/dal";
import { AdminShell } from "@/components/admin/layout/AdminShell";

/** Todo lo que vive aquí dentro exige sesión iniciada. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <AdminShell user={{ name: session.name, role: session.role }}>
      {children}
    </AdminShell>
  );
}
