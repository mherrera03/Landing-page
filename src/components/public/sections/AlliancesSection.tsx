import Image from "next/image";
import { findVisible } from "@/server/database/repositories/partners.repository";
import { PARTNER_GROUP_LABELS, PARTNER_GROUPS, type Partner } from "@/types/partner.types";
import { Reveal } from "../motion/Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

/** Un logo dentro de su recuadro. Si tiene página web, el recuadro es un enlace. */
function LogoTile({ name, logo: src, url: href }: Partner) {
  const image = (
    <span className="relative block h-14 w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.07] sm:h-16">
      <Image src={src} alt={name} fill sizes="(min-width: 1024px) 200px, 45vw" className="object-contain" />
    </span>
  );
  // Al pasar el cursor el recuadro se eleva, se ilumina con el color de la marca y el logo crece un poco
  const tile =
    "group flex h-24 items-center justify-center rounded-2xl border border-line bg-surface px-5 transition-[border-color,box-shadow,translate] duration-300 ease-out-expo sm:h-28 " +
    "hover:-translate-y-1.5 hover:border-violet/40 hover:shadow-[0_18px_40px_-12px_rgb(196_113_237/0.45)]";

  if (!href) return <div className={tile}>{image}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      className={tile}
    >
      {image}
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </a>
  );
}

/** Logos de instituciones aliadas y socias. Se administran en el panel, en Aliados. */
export async function AlliancesSection() {
  const partners = await findVisible();
  const groups = PARTNER_GROUPS.map((group) => ({
    title: PARTNER_GROUP_LABELS[group],
    logos: partners.filter((partner) => partner.group === group),
  })).filter((group) => group.logos.length > 0);
  if (groups.length === 0) return null;

  return (
    <Section id="alianzas">
      <div className="container-page">
        <SectionHeading id="alianzas-titulo" kicker="Alianzas" title="Juntos llegamos más lejos" centered>
        </SectionHeading>

        <div className="space-y-10">
          {groups.map((group) => (
            <Reveal key={group.title}>
              <h3 className="text-gradient mb-5 text-center text-xl font-extrabold tracking-tight sm:text-2xl">{group.title}</h3>
              <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {group.logos.map((logo, i) => (
                  <Reveal
                    as="li"
                    key={logo.id}
                    delay={0.08 * i}
                    className="w-[calc(50%-0.375rem)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
                  >
                    {/* Flotan sin parar, cada uno a destiempo; se detienen al pasar el cursor */}
                    <div
                      className="animate-[logo-float_4.5s_ease-in-out_infinite] hover:[animation-play-state:paused]"
                      style={{ animationDelay: `${-0.9 * i}s` }}
                    >
                      <LogoTile {...logo} />
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
