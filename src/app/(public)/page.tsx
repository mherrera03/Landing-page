import { getFeaturedCourse } from "@/services/courses.service";
import { connection } from "next/server";
import { Hero } from "@/components/public/hero/Hero";
import { AboutSection } from "@/components/public/sections/AboutSection";
import { StatsSection } from "@/components/public/sections/StatsSection";
import { ServicesSection } from "@/components/public/sections/ServicesSection";
import { AudienceSection } from "@/components/public/sections/AudienceSection";
import { CoursesSection } from "@/components/public/sections/CoursesSection";
import { EventsSection } from "@/components/public/sections/EventsSection";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { getLandingSettings } from "@/server/database/repositories/settings.repository";
import { todayInElSalvador } from "@/lib/dates";

export default async function HomePage() {
  await connection();
  const featured = await getFeaturedCourse();
  const landing = getLandingSettings();
  const currentYear = Number(todayInElSalvador().slice(0, 4));

  return (
    <>
      <Hero course={featured} settings={landing} />
      <AboutSection />
      <StatsSection settings={landing} currentYear={currentYear} />
      <ServicesSection />
      <AudienceSection />
      <CoursesSection />
      <EventsSection />
      <ContactSection />
    </>
  );
}
