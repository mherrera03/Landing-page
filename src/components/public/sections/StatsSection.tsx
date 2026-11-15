"use client";

import { useRef } from "react";
import { STATS, type StatKey } from "@/constants/stats";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { LandingSettings } from "@/schemas/landing.schema";

/** 1500 -> "1,500". Mismo resultado en servidor y navegador (evita errores de hidratación). */
const formatNumber = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function StatsSection({ settings, currentYear }: { settings: LandingSettings; currentYear: number }) {
  const root = useRef<HTMLElement>(null);

  const values: Record<StatKey, number> = {
    years: Math.max(0, currentYear - settings.foundingYear),
    people: settings.peopleTrained,
    programs: settings.programsDelivered,
    satisfaction: settings.satisfactionPercent,
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
        <dl className="grid divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {STATS.map(({ key, icon: Icon, prefix, suffix, label }) => (
            <div key={key} className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-soft text-violet-deep">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <dd className="text-[clamp(2rem,3.4vw,2.75rem)] leading-none font-extrabold tracking-tight text-gradient tabular-nums">
                {prefix}
                <span data-stat={values[key]}>{formatNumber(values[key])}</span>
                {suffix}
              </dd>
              <dt className="text-sm text-muted">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
