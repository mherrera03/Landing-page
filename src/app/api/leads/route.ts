import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema } from "@/schemas/lead.schema";
import * as repo from "@/server/database/repositories/leads.repository";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Datos inválidos", fields: z.flattenError(result.error).fieldErrors }, { status: 422 });
  }

  try {
    repo.insert(result.data);
  } catch (error) {
    // Si falla el guardado, el mensaje se perdería en silencio: queda en el
    // registro del servidor para poder recuperarlo a mano.
    console.error("[lead] no se pudo guardar", error, result.data);
    return NextResponse.json({ error: "No pudimos guardar tu solicitud. Vuelve a intentarlo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
