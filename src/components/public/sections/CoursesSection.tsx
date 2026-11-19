import { findVisible } from "@/server/database/repositories/courses.repository";
import { CourseGrid } from "../courses/CourseGrid";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export async function CoursesSection() {
  return (
    <Section id="programas">
      <div className="container-page">
        <SectionHeading id="programas-titulo" kicker="Explora" title="Programas y cursos">
        </SectionHeading>
        <CourseGrid courses={await findVisible()} />
      </div>
    </Section>
  );
}
