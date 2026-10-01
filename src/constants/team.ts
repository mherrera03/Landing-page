export type Specialist = {
  name: string;
  photo: string;
  /** Texto alternativo de la foto, para lectores de pantalla. */
  photoAlt: string;
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
    photo: "/images/team/pedro-canizales.png",
    photoAlt: "Pedro Canizales",
    whatsapp: "50326456572",
    email: "pcanizales@ugb.edu.sv",
  },
  {
    name: "Michelle Portillo",
    photo: "/images/team/michelle-portillo.png",
    photoAlt: "Michelle Portillo",
    whatsapp: "50326456571",
    email: "gportillo@ugb.edu.sv",
  },
  {
    name: "Juan Villalta",
    photo: "/images/team/juan-villalta.png",
    photoAlt: "Juan Villalta",
    whatsapp: "50326456571",
    email: "jvillalta@ugb.edu.sv",
  },
];
