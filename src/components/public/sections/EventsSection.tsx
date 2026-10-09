import { getEvents } from "@/services/events.service";
import { EventGrid } from "../events/EventGrid";
import { FeaturedEvent } from "../events/FeaturedEvent";
import { SectionHeading } from "./SectionHeading";

export async function EventsSection() {
  const events = await getEvents();
  const featured = events.find((e) => e.startsAt && e.image);
  const others = events.filter((e) => e !== featured);

  return (
    <section id="eventos" aria-labelledby="eventos-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-ink px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand opacity-30 blur-3xl" />
          <div className="relative">
            <SectionHeading id="eventos-titulo" kicker="Agenda UGB Plus" title="Noticias y próximos eventos" onDark>
              Masterclasses, aperturas de cohortes y programas para empresas.
            </SectionHeading>

            {featured && (
              <div className="mb-14 lg:mb-16">
                <FeaturedEvent event={featured} />
              </div>
            )}

            {others.length > 0 && <EventGrid events={others} />}
          </div>
        </div>
      </div>
    </section>
  );
}