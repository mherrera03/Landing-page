import { connection } from "next/server";
import { todayInElSalvador } from "@/lib/dates";
import { findFeatured } from "@/server/database/repositories/courses.repository";
import { getLandingSettings } from "@/server/database/repositories/settings.repository";
import { Hero } from "@/components/public/hero/Hero";
import { AboutSection } from "@/components/public/sections/AboutSection";
import { AudienceSection } from "@/components/public/sections/AudienceSection";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { CoursesSection } from "@/components/public/sections/CoursesSection";
import { EventsSection } from "@/components/public/sections/EventsSection";
import { ServicesSection } from "@/components/public/sections/ServicesSection";
import { StatsSection } from "@/components/public/sections/StatsSection";

export default async function HomePage() {
  // Se genera en cada visita: cursos, eventos y cifras salen de la base de datos
  await connection();

  const landing = await getLandingSettings();
  const currentYear = Number(todayInElSalvador().slice(0, 4));

  return (
    <>
      <Hero course={await findFeatured()} settings={landing} />
      <AboutSection foundingYear={landing.foundingYear} />
      <StatsSection settings={landing} currentYear={currentYear} />
      <ServicesSection />
      <AudienceSection />
      <CoursesSection />
      <EventsSection />
      <ContactSection />
    </>
  );
}
