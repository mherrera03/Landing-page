import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Pencil } from "lucide-react";

import { toggleBannerVisibilityAction } from "@/server/actions/banners.actions";
import type { Banner } from "@/types/banner.types";
import { cn } from "@/lib/utils";

export function BannerTable({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-surface px-6 py-14 text-center">
        <p className="font-semibold text-ink">Todavía no hay imágenes de banner</p>

        <p className="mt-1 text-sm text-muted">
          Sube la primera y aparecerá en la landing.
        </p>

        <Link
          href="/admin/banners/nuevo"
          className="mt-4 inline-flex min-h-11 items-center px-3 font-bold text-violet-deep"
        >
          Agregar imagen
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {banners.map((banner) => (
        <li
          key={banner.id}
          className={cn(
            "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center",
            !banner.visible && "opacity-70"
          )}
        >
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-paper sm:h-20 sm:w-40">
            <Image
              src={banner.image}
              alt={banner.imageAlt}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-bold text-ink">{banner.imageAlt}</h2>

              {!banner.visible && (
                <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">
                  Oculto
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-muted">
              Actualizado el {banner.updatedAt.slice(0, 10)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <form action={toggleBannerVisibilityAction}>
              <input type="hidden" name="id" value={banner.id} />

              <button
                type="submit"
                title={banner.visible ? "Ocultar de la landing" : "Mostrar en la landing"}
                aria-label={
                  banner.visible
                    ? `Ocultar ${banner.imageAlt}`
                    : `Mostrar ${banner.imageAlt}`
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
              >
                {banner.visible ? (
                  <Eye className="size-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="size-4" aria-hidden="true" />
                )}

                <span className="sr-only sm:not-sr-only">
                  {banner.visible ? "Visible" : "Oculto"}
                </span>
              </button>
            </form>

            <Link
              href={`/admin/banners/${banner.id}/editar`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
              <span className="sr-only">{banner.imageAlt}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
