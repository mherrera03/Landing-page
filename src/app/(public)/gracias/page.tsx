import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/constants/site";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Solicitud enviada",
  description: "Recibimos tu solicitud de información.",
};

export default function ThanksPage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
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
    </section>
  );
}
