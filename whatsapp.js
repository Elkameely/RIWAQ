import { ACADEMY } from '../config';

export const waLink = (message = 'Assalamu alaykum, I would like to know more about RIWAQUL ILM.') =>
  `https://wa.me/${ACADEMY.whatsapp}?text=${encodeURIComponent(message)}`;
