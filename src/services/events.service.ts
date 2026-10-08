import "server-only";
import type { EventItem } from "@/types/event.types";
import * as repo from "@/server/database/repositories/events.repository";

/** Eventos visibles, para la landing. Se administran desde /admin/eventos. */
export async function getEvents(): Promise<EventItem[]> {
  return repo.findVisible();
}
