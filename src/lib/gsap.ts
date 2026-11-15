import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Los plugins se registran una sola vez, aquí: quien necesite GSAP lo importa
// de este archivo y no tiene que acordarse de registrarlos.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
