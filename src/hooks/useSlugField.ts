"use client";

import { useState, type ChangeEvent } from "react";
import { slugify } from "@/lib/text";

type TextChange = ChangeEvent<HTMLInputElement>;

/**
 * Campo "Dirección en la web" de los formularios del panel.
 *
 * Al crear, la dirección se va generando desde el título hasta que la persona
 * la edita a mano. Al editar (`locked`) no se toca sola: cambiarla rompería los
 * enlaces que ya se hayan compartido.
 */
export function useSlugField(initialSlug: string, locked: boolean) {
  const [slug, setSlug] = useState(initialSlug);
  const [touched, setTouched] = useState(locked);

  return {
    slug,
    onTitleChange: (e: TextChange) => {
      if (!touched) setSlug(slugify(e.target.value));
    },
    onSlugChange: (e: TextChange) => {
      setTouched(true);
      setSlug(e.target.value);
    },
  };
}
