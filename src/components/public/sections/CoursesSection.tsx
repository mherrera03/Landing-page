import { findVisible } from "@/server/database/repositories/courses.repository";
import { CourseGrid } from "../courses/CourseGrid";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function CoursesSection() {
  return (
    <Section id="programas">
      <div className="container-page">
        <SectionHeading id="programas-titulo" kicker="Explora" title="Programas y cursos">
          Filtra por área y abre cada curso para conocer su nivel, duración y modalidad.
        </SectionHeading>
        <CourseGrid courses={findVisible()} />
      </div>
    </Section>
  );
}
