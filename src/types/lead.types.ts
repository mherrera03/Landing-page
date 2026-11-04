/** Una solicitud de contacto enviada desde la landing. */
export type Lead = {
  id: number;
  name: string;
  email: string;
  country: string;
  phone: string;
  interest: string;
  message: string;
  /** Ya la atendió alguien del equipo. */
  attended: boolean;
  createdAt: string;
};
