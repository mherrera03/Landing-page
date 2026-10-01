import { getCourses } from "@/services/courses.service";
import { CourseGrid } from "../courses/CourseGrid";
import { SectionHeading } from "./SectionHeading";

export async function CoursesSection() {
  const courses = await getCourses();

  return (
    <section id="programas" aria-labelledby="programas-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading id="programas-titulo" kicker="Explora" title="Programas y cursos">
          Filtra por área y abre cada curso para conocer su nivel, duración y modalidad.
        </SectionHeading>
        <CourseGrid courses={courses} />
      </div>
    </section>
  );
}
