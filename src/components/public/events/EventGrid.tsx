import type { EventItem } from "@/types/event.types";
import { Reveal } from "../motion/Reveal";
import { EventCard } from "./EventCard";
import { FeaturedEvent } from "./FeaturedEvent";

export function EventGrid({ events }: { events: EventItem[] }) {
  // El destacado va arriba en grande; el resto, en tarjetas
  const featured = events.find((e) => e.featured) ?? null;
  const resto = featured ? events.filter((e) => e.id !== featured.id) : events;

  return (
    <>
      {featured && (
        <Reveal>
          <FeaturedEvent event={featured} />
        </Reveal>
      )}

      {resto.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-3">
          {resto.map((event, i) => (
            <Reveal as="li" key={event.id} delay={0.07 * i}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
