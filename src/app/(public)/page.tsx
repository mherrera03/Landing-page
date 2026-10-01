import { getFeaturedCourse } from "@/services/courses.service";
import { Hero } from "@/components/public/hero/Hero";
import { AboutSection } from "@/components/public/sections/AboutSection";
import { StatsSection } from "@/components/public/sections/StatsSection";
import { ServicesSection } from "@/components/public/sections/ServicesSection";
import { AudienceSection } from "@/components/public/sections/AudienceSection";
import { CoursesSection } from "@/components/public/sections/CoursesSection";
import { EventsSection } from "@/components/public/sections/EventsSection";
import { ContactSection } from "@/components/public/sections/ContactSection";

export default async function HomePage() {
  const featured = await getFeaturedCourse();

  return (
    <>
      <Hero course={featured} />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <AudienceSection />
      <CoursesSection />
      <EventsSection />
      <ContactSection />
    </>
  );
}
