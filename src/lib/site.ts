export const PHONE = "+90 533 821 61 72";
export const PHONE_TEL = "+905338216172";
export const WHATSAPP = "905338216172";
export const EMAIL = "info@pragmatechnical.com.tr";
export const COMPANY = "PRAGMATECHNICAL";
export const ADDRESS_STREET = "Türk Mahallesi No: 10";
export const ADDRESS_REGION = "KKTC/GİRNE";
/** İki satırlı görüntüleme (footer, iletişim) */
export const ADDRESS = `${ADDRESS_STREET}\n${ADDRESS_REGION}`;
/** Tek satır özet */
export const ADDRESS_INLINE = `${ADDRESS_STREET}, ${ADDRESS_REGION}`;
/** OpenStreetMap embed — Girne */
export const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=33.28%2C35.31%2C33.36%2C35.35&layer=mapnik&marker=35.34%2C33.32";
export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_INLINE)}`;

export const waLink = (msg = `Merhaba, ${COMPANY} hizmetleriniz hakkında bilgi almak istiyorum.`) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
