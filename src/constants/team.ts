export type Specialist = {
  name: string;
  photo: string;
  /** Texto alternativo de la foto, para lectores de pantalla. */
  photoAlt: string;
  /** Número en formato internacional sin signos, como lo pide wa.me (ej. 50326456572). */
  whatsapp: string;
  /** Cómo se muestra el número en pantalla. */
  phoneLabel: string;
  email: string;
};

/** Equipo que atiende las consultas de la landing. */
export const SPECIALISTS: Specialist[] = [
  {
    name: "Pedro Canizales",
    photo: "/images/team/pedro-canizales.png",
    photoAlt: "Pedro Canizales",
    whatsapp: "50326456572",
    phoneLabel: "+503 2645-6572",
    email: "pcanizales@ugb.edu.sv",
  },
  {
    name: "Michelle Portillo",
    photo: "/images/team/michelle-portillo.png",
    photoAlt: "Michelle Portillo",
    whatsapp: "50326456571",
    phoneLabel: "+503 2645-6571",
    email: "gportillo@ugb.edu.sv",
  },
  {
    name: "Juan Villalta",
    photo: "/images/team/juan-villalta.png",
    photoAlt: "Juan Villalta",
    whatsapp: "50326456571",
    phoneLabel: "+503 2645-6571",
    email: "jvillalta@ugb.edu.sv",
  },
];
