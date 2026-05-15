export const PHONE = "+90 533 821 61 72";
export const PHONE_TEL = "+905338216172";
export const WHATSAPP = "905338216172";
export const EMAIL = "info@fixatech.com.tr";
export const COMPANY = "FİXATECH";
export const ADDRESS = "İstanbul, Türkiye";

export const waLink = (msg = "Merhaba, FİXATECH hizmetleriniz hakkında bilgi almak istiyorum.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
