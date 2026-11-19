import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Botón de acción principal, a la derecha. */
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span aria-hidden="true" className="admin-rule mb-4 block w-12" />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[2rem] sm:leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-[0.95rem]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
