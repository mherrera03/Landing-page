"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/leads.repository";
import { readId } from "@/server/forms";

export async function toggleLeadAttendedAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id === null) return;

  await repo.toggleAttended(id);
  revalidatePath("/admin/solicitudes");
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id !== null) {
    await repo.remove(id);
    revalidatePath("/admin/solicitudes");
  }

  redirect("/admin/solicitudes?eliminado=1");
}
