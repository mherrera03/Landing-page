import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/public/layout/Logo";
import { LoginForm } from "@/components/admin/auth/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { siguiente } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-line bg-surface p-7 shadow-soft sm:p-8">
          <Logo size="sm" />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">Panel administrativo</h1>
          <p className="mt-1.5 text-sm text-muted">Ingresa para administrar el contenido de la landing.</p>

          <LoginForm siguiente={typeof siguiente === "string" ? siguiente : undefined} />
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a la landing
        </Link>
      </div>
    </main>
  );
}
