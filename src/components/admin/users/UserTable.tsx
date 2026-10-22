import Link from "next/link";
import { Pencil, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toggleUserActiveAction } from "@/server/actions/users.actions";
import { USER_ROLE_LABELS, type AdminUser } from "@/types/user.types";
import { cn } from "@/lib/utils";

type UserTableProps = {
  users: AdminUser[];
  /** Para marcar tu propia cuenta y no ofrecer acciones que te dejarían fuera. */
  currentUserId: number;
};

export function UserTable({ users, currentUserId }: UserTableProps) {
  // Si solo queda un admin activo, su acceso no se puede quitar desde aquí
  const adminsActivos = users.filter((u) => u.role === "admin" && u.active).length;

  return (
    <ul className="grid gap-3">
      {users.map((usuario) => {
        const esMiCuenta = usuario.id === currentUserId;
        const esUltimoAdmin = usuario.role === "admin" && usuario.active && adminsActivos === 1;
        const bloqueado = esMiCuenta || esUltimoAdmin;

        return (
          <li
            key={usuario.id}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center",
              !usuario.active && "opacity-70",
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper text-lg font-extrabold text-violet-deep"
            >
              {usuario.name.charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-bold text-ink">{usuario.name}</h2>

                {usuario.role === "admin" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-xs font-semibold text-violet-deep">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    {USER_ROLE_LABELS.admin}
                  </span>
                )}

                {esMiCuenta && (
                  <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Tú</span>
                )}

                {!usuario.active && (
                  <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Sin acceso</span>
                )}
              </div>

              <p className="mt-0.5 truncate text-sm text-muted">
                {usuario.email}
                {usuario.role === "editor" && ` · ${USER_ROLE_LABELS.editor}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {bloqueado ? (
                <span
                  title={
                    esMiCuenta
                      ? "No puedes quitarte el acceso a ti mismo"
                      : "Es el único administrador activo: nombra a otro antes de quitarle el acceso"
                  }
                  className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-muted/60"
                >
                  <UserCheck className="size-4" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Con acceso</span>
                </span>
              ) : (
                <form action={toggleUserActiveAction}>
                  <input type="hidden" name="id" value={usuario.id} />
                  <button
                    type="submit"
                    title={usuario.active ? "Quitar el acceso al panel" : "Devolver el acceso al panel"}
                    aria-label={
                      usuario.active ? `Quitar el acceso a ${usuario.name}` : `Devolver el acceso a ${usuario.name}`
                    }
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
                  >
                    {usuario.active ? (
                      <UserCheck className="size-4" aria-hidden="true" />
                    ) : (
                      <UserX className="size-4" aria-hidden="true" />
                    )}
                    <span className="sr-only sm:not-sr-only">{usuario.active ? "Con acceso" : "Sin acceso"}</span>
                  </button>
                </form>
              )}

              <Link
                href={`/admin/usuarios/${usuario.id}/editar`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Editar
                <span className="sr-only">{usuario.name}</span>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
