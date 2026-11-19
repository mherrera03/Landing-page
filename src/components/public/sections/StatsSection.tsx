"use client";

import { useRef } from "react";
import Image from "next/image";
import { STATS, type StatKey } from "@/constants/stats";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { LandingSettings } from "@/schemas/landing.schema";

/** 1500 -> "1,500". Mismo resultado en servidor y navegador (evita errores de hidratación). */
const formatNumber = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function StatsSection({ settings }: { settings: LandingSettings }) {
  const root = useRef<HTMLElement>(null);

  const values: Record<StatKey, number> = {
    people: settings.peopleTrained,
    programs: settings.programsDelivered,
  };

  // Los números suben desde cero la primera vez que la franja entra en pantalla
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // El contador se crea dentro de onEnter: así el número final que viene del
        // servidor se mantiene intacto hasta que la franja entra en pantalla.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((el, i) => {
              const end = Number(el.dataset.stat);
              const counter = { value: 0 };
              gsap.to(counter, {
                value: end,
                duration: 1.4,
                delay: i * 0.08,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = formatNumber(Math.round(counter.value));
                },
              });
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="UGB Plus en cifras" className="pb-2 lg:pb-4">
      <div className="container-page">
        <dl className="grid grid-cols-2 divide-x divide-line overflow-hidden rounded-3xl border border-line bg-surface">
          {STATS.map(({ key, icon: Icon, prefix, suffix, label, image }) => (
            <div
              key={key}
              className={cn(
                "relative isolate flex flex-col items-center justify-center gap-2 px-4 py-8 text-center sm:px-6",
                image && "min-h-56 sm:min-h-64",
              )}
            >
              {image && (
                <>
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1200px) 600px, 50vw" className="-z-20 object-cover" />
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
                </>
              )}
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl",
                  image ? "bg-white/15 text-white backdrop-blur" : "bg-violet-soft text-violet-deep",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <dd
                className="text-[clamp(2rem,3.4vw,2.75rem)] leading-none font-extrabold tracking-tight text-gradient tabular-nums"
                style={image ? { backgroundImage: "var(--grad)" } : undefined}
              >
                {prefix}
                <span data-stat={values[key]}>{formatNumber(values[key])}</span>
                {suffix}
              </dd>
              <dt className={cn("text-sm", image ? "font-medium text-white" : "text-muted")}>{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
