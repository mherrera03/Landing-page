import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { COUNTRY_PHONE_REGION, type Country } from "@/constants/country-phone";

/** Ningún número nacional pasa de 15 dígitos (norma E.164). */
const MAX_DIGITS = 15;

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/** Clave del país con el signo +, por ejemplo "+503". */
export function dialCode(country: Country): string {
  return `+${getCountryCallingCode(COUNTRY_PHONE_REGION[country])}`;
}

/** Número de ejemplo en formato nacional, para el placeholder ("7012 3456"). */
export function examplePhone(country: Country): string {
  return getExampleNumber(COUNTRY_PHONE_REGION[country], examples)?.formatNational() ?? "";
}

/** Da formato nacional a los dígitos mientras se escriben ("77777777" → "7777 7777"). */
export function formatNational(country: Country, digits: string): string {
  return digits ? new AsYouType(COUNTRY_PHONE_REGION[country]).input(digits) : "";
}

/**
 * Convierte lo que se escribió en el campo a solo dígitos del número nacional.
 * - Descarta letras y símbolos.
 * - Si se pega un número con clave (+503 7777-7777) de ese mismo país, quita la clave.
 * - Si se borró un separador (espacio o guion), borra también el dígito anterior;
 *   si no, el formato lo volvería a poner y parecería que la tecla no hace nada.
 */
export function readPhoneInput(country: Country, raw: string, previousDigits: string): string {
  let digits = onlyDigits(raw);

  if (raw.trim().startsWith("+")) {
    const parsed = parsePhoneNumberFromString(raw);
    if (parsed && `+${parsed.countryCallingCode}` === dialCode(country)) digits = parsed.nationalNumber;
  }

  const deletedSeparator =
    digits === previousDigits && raw.length < formatNational(country, previousDigits).length;
  if (deletedSeparator) digits = digits.slice(0, -1);

  return digits.slice(0, MAX_DIGITS);
}

/**
 * Número completo que se guarda, en formato internacional ("+503 7777 7777").
 * El panel de admin quita todo lo que no es dígito para armar el enlace de WhatsApp.
 */
export function toInternational(country: Country, digits: string): string {
  if (!digits) return "";
  const parsed = parsePhoneNumberFromString(digits, COUNTRY_PHONE_REGION[country]);
  return parsed ? parsed.formatInternational() : `${dialCode(country)} ${digits}`;
}
