"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/leads.repository";

function refreshPages() {
  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin");
}

/** Lee el id del formulario y comprueba que la solicitud exista. */
function leerId(formData: FormData): number | null {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return repo.findById(id) ? id : null;
}

export async function toggleLeadAttendedAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = leerId(formData);
  if (id === null) return;

  repo.toggleAttended(id);
  refreshPages();
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = leerId(formData);
  if (id !== null) {
    repo.remove(id);
    refreshPages();
  }

  redirect("/admin/solicitudes?eliminado=1");
}
