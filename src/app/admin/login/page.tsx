import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/constants/site";
import { Logo } from "@/components/public/layout/Logo";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { LoginSlideshow } from "@/components/admin/auth/LoginSlideshow";
import { publicSiteUrl } from "@/lib/hosts";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { siguiente } = await searchParams;

  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1">
      {/*
        Panel de marca. En escritorio es la mitad izquierda; en celular, una
        franja superior, para que el formulario siga visible sin desplazarse.
        Lleva tres capas: las fotos del cliente que se van pasando, el degradado
        de marca que las tiñe, y un velo oscuro que sube desde el pie.

        Todo el texto va abajo a propósito. Es lo que permite que el velo sea
        fuerte justo donde hay que leer y se desvanezca a nada en la parte de
        arriba, que es donde se ve la foto. Si el texto se repartiera de arriba
        abajo haría falta oscurecer el panel entero y las fotos no se
        distinguirían.
      */}
      <section className="relative isolate flex min-h-40 flex-col justify-end overflow-hidden bg-ink px-6 py-7 sm:px-10 lg:min-h-0 lg:px-12 lg:py-14">
        <LoginSlideshow />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-brand opacity-55" />
          {/* Calibrado para el peor caso: una foto con una zona casi blanca
              (el videowall de la ponencia). Incluso ahí, en la franja donde
              está el texto, el blanco queda por encima de 13:1. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 from-25% via-ink/55 via-55% to-transparent" />
        </div>

        {/*
          En celular se ocultan el sello y el aviso: se repiten con el logo del
          otro lado y empujarían el botón de "Ingresar" fuera de la pantalla.
        */}
        <div className="relative text-white">
          {/* El logo del proyecto es multicolor y no existe versión en blanco,
              así que aquí la marca va en texto y el logo vive en el lado blanco. */}
          <p className="hidden text-xs font-bold tracking-[0.2em] uppercase lg:block">{SITE.name}</p>

          <p className="text-[clamp(1.6rem,5vw,3.25rem)] leading-[1.05] font-extrabold tracking-[-0.04em] lg:mt-3">
            {SITE.tagline}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90 lg:mt-3 lg:text-base">
            {SITE.university}
          </p>

          <p className="mt-6 hidden text-xs font-medium text-white lg:block">
            Acceso restringido al personal autorizado.
          </p>
        </div>
      </section>

      {/* Formulario: siempre sobre blanco, sin tocar nada de su interior. */}
      <section className="grid place-items-center bg-surface px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-sm">
          <Logo size="sm" />

          <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-ink">Panel administrativo</h1>
          <p className="mt-1.5 text-sm text-muted">Ingresa para administrar el contenido de la landing.</p>

          <LoginForm siguiente={typeof siguiente === "string" ? siguiente : undefined} />

          <Link
            href={publicSiteUrl("/")}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a la landing
          </Link>
        </div>
      </section>
    </main>
  );
}
