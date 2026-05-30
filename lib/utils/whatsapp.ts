/**
 * WhatsApp Click-to-Chat utility
 * Generates wa.me links — no API, no server, completely free.
 */

export function getWhatsAppChatUrl(
  phone: string,
  message?: string
): string {
  const normalized = phone.replace(/\D/g, "");
  const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${encoded}`;
}
