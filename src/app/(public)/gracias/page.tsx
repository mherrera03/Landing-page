import type { Metadata } from "next";
import { connection } from "next/server";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";
import { getSettings } from "@/server/database/repositories/settings.repository";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Solicitud enviada",
  description: "Recibimos tu solicitud de información.",
};

export default async function ThanksPage() {
  await connection();
  // Quien prefiera no esperar tiene otra salida: escribir directo por WhatsApp
  const whatsapp = (await getSettings()).whatsapp1.replace(/\D/g, "");

  return (
    <section className="container-page flex min-h-[60svh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-violet-soft text-violet-deep">
        <CheckCircle2 className="size-9" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold tracking-[-0.035em] text-ink">¡Gracias! Recibimos tu solicitud.</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        El equipo de {SITE.name} revisará tu mensaje y te contactará al correo que nos dejaste con la información del programa que
        te interesa.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/#programas" size="lg">
          Seguir explorando cursos
        </Button>
        <Button href="/" size="lg" variant="ghost">
          Volver al inicio
        </Button>
      </div>
      {whatsapp && (
        <p className="mt-8 text-sm text-muted">
          ¿Prefieres hablar ya con alguien?{" "}
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 font-bold text-violet-deep underline-offset-4 hover:underline"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Escríbenos por WhatsApp
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </p>
      )}
    </section>
  );
}
