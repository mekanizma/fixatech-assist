const DELIVERY_LABELS: Record<string, string> = {
  onsite: "Yerinde Servis",
  pickup: "Adresten Alım",
  dropoff: "Kendim Getireceğim",
};

const URGENCY_LABELS: Record<string, string> = {
  normal: "Normal",
  urgent: "Acil",
  emergency: "7/24 Acil",
};

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
