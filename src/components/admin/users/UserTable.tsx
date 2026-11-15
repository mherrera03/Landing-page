import { ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toggleUserActiveAction } from "@/server/actions/users.actions";
import { USER_ROLE_LABELS, type AdminUser } from "@/types/user.types";
import { EditLink, ListRow, Pill, rowButton } from "../ui/ListItems";

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

        return (
          <ListRow key={usuario.id} dimmed={!usuario.active}>
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
                  <Pill icon={ShieldCheck} accent>
                    {USER_ROLE_LABELS.admin}
                  </Pill>
                )}
                {esMiCuenta && <Pill>Tú</Pill>}
                {!usuario.active && <Pill>Sin acceso</Pill>}
              </div>

              <p className="mt-0.5 truncate text-sm text-muted">
                {usuario.email}
                {usuario.role === "editor" && ` · ${USER_ROLE_LABELS.editor}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {esMiCuenta || esUltimoAdmin ? (
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
                    aria-label={usuario.active ? `Quitar el acceso a ${usuario.name}` : `Devolver el acceso a ${usuario.name}`}
                    className={rowButton}
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

              <EditLink href={`/admin/usuarios/${usuario.id}/editar`} title={usuario.name} />
            </div>
          </ListRow>
        );
      })}
    </ul>
  );
}
