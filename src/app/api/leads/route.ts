import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema } from "@/schemas/lead.schema";

// TEMPORAL: por ahora solo valida y registra en consola.
// PENDIENTE: guardar en la base de datos (tabla leads) y mostrarlo en el panel admin.
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

  console.log("[lead]", { ...result.data, recibido: new Date().toISOString() });

  return NextResponse.json({ ok: true }, { status: 201 });
}
