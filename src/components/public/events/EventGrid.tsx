import type { EventItem } from "@/types/event.types";
import { Reveal } from "../motion/Reveal";
import { EventCard } from "./EventCard";

export function EventGrid({ events }: { events: EventItem[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {events.map((event, i) => (
        <Reveal as="li" key={event.id} delay={0.07 * i}>
          <EventCard event={event} />
        </Reveal>
      ))}
    </ul>
  );
}
