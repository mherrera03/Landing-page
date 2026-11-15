import type { ReactNode } from "react";

type SectionProps = {
  /** Ancla del menú (/#contacto). El título de la sección debe llevar el id `${id}-titulo`. */
  id: string;
  children: ReactNode;
};

/** Sección de la landing: fija el ancla, el título accesible y la separación vertical común. */
export function Section({ id, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="py-10 lg:pt-[55px] lg:pb-[54px]">
      {children}
    </section>
  );
}
