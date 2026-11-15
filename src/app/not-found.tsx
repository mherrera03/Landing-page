import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-bold tracking-[0.18em] text-violet-deep uppercase">Error 404</p>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.035em] text-ink">No encontramos esta página</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        Es posible que el enlace haya cambiado o que la página ya no exista.
      </p>
      <Button href="/" size="lg" className="mt-8">
        Volver al inicio
      </Button>
    </section>
  );
}
