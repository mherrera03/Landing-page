"use server";
export type EventFormState = {
  error?: string;
  fields?: Record<string, string | undefined>;
  values?: Record<string, string>;
};

import { revalidatePath } from "next/cache";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/events.repository";

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

export async function toggleEventVisibilityAction(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));

  if (!Number.isSafeInteger(id) || id <= 0) {
    return;
  }

  if (!repo.getEventById(id)) {
    return;
  }

  repo.toggleEventVisibility(id);
  refreshPages();
}