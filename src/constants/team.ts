export type Specialist = {
  name: string;
  /** Número en formato internacional sin signos, como lo pide wa.me (ej. 50326456572). */
  whatsapp: string;
  email: string;
};

/**
 * Equipo que atiende las consultas de la landing.
 * Nota: Michelle y Juan comparten el mismo número (línea de oficina). No es un error.
 */
export const SPECIALISTS: Specialist[] = [
  {
    name: "Pedro Canizales",
    whatsapp: "50326456572",
    email: "pcanizales@ugb.edu.sv",
  },
  {
    name: "Michelle Portillo",
    whatsapp: "50326456571",
    email: "gportillo@ugb.edu.sv",
  },
  {
    name: "Juan Villalta",
    whatsapp: "50326456571",
    email: "jvillalta@ugb.edu.sv",
  },
];
