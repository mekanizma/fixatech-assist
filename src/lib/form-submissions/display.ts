export const DELIVERY_LABELS: Record<string, string> = {
  onsite: "Yerinde Servis",
  pickup: "Adresten Alım",
  dropoff: "Kendim Getireceğim",
};

export const URGENCY_LABELS: Record<string, string> = {
  normal: "Normal",
  urgent: "Acil",
  emergency: "7/24 Acil",
};

export const TECH_CATEGORIES = [
  "Endüstriyel Mutfak Ekipmanı",
  "Soğutma & Buzdolabı",
  "Elektrik / Elektronik",
  "Su Tesisatı / Pompa",
  "Havalandırma / Klima",
  "Genel Tamirat",
  "Diğer",
] as const;

export const TECH_TIME_SLOTS = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
] as const;

export const TECH_DELIVERY_OPTIONS = [
  { value: "onsite", label: "Yerinde Servis", desc: "Teknisyen işletmeye gelir" },
  { value: "dropoff", label: "Kendim Getireceğim", desc: "Ürün servis merkezine getirilir" },
  { value: "pickup", label: "Adresten Alım", desc: "Ekip ürünü adresten teslim alır" },
] as const;

export const TECH_URGENCY_OPTIONS = [
  { value: "normal", label: "Normal", desc: "1–2 iş günü içinde" },
  { value: "urgent", label: "Acil", desc: "Aynı veya ertesi gün" },
  { value: "emergency", label: "7/24 Acil", desc: "Kritik arıza — anında müdahale" },
] as const;

export function payloadStr(payload: Record<string, unknown>, key: string): string {
  const v = payload[key];
  if (v == null || v === "") return "";
  return String(v);
}

export function payloadDisplay(payload: Record<string, unknown>, key: string): string {
  const s = payloadStr(payload, key);
  return s || "—";
}

export function deliveryLabel(value: string): string {
  return DELIVERY_LABELS[value] ?? (value || "—");
}

export function urgencyLabel(value: string): string {
  return URGENCY_LABELS[value] ?? (value || "—");
}

export type ContactPayload = {
  name?: string;
  company?: string;
  service?: string;
  message?: string;
};

export type TechServicePayload = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  productName?: string;
  category?: string;
  quantity?: string;
  brand?: string;
  model?: string;
  serialNo?: string;
  issue?: string;
  address?: string;
  district?: string;
  city?: string;
  delivery?: string;
  pickupDate?: string;
  pickupTime?: string;
  urgency?: string;
  notes?: string;
};

export function asTechPayload(payload: Record<string, unknown>): TechServicePayload {
  return payload as TechServicePayload;
}

export function asContactPayload(payload: Record<string, unknown>): ContactPayload {
  return payload as ContactPayload;
}
