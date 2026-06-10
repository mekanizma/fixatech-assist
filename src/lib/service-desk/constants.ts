import type { BusinessType, ServiceMode, ServiceStatus, Urgency } from "./types";

export const STORAGE_KEY = "pragmatechnical-service-desk-v1";
export const SESSION_KEY = "pragmatechnical-session-v1";

/** Servis kayıt no öneki — PRAGMATECHNICAL (eski: FIX-) */
export const TICKET_CODE_PREFIX = "PRAGMA";

export const PRODUCT_TYPES = [
  "Endüstriyel Fırın",
  "Buzdolabı",
  "Soğutucu",
  "Kahve Makinesi",
  "Bulaşık Makinesi",
  "Elektrik Sistemi",
  "Su Tesisatı",
  "Diğer",
] as const;

export const TIME_SLOTS = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
] as const;

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: "Beklemede",
  assigned: "Teknik Ekip Atandı",
  en_route: "Yolda",
  in_progress: "İşlem Yapılıyor",
  waiting_parts: "Parça Bekleniyor",
  completed: "Tamamlandı",
};

export const STATUS_ORDER: ServiceStatus[] = [
  "pending",
  "assigned",
  "en_route",
  "in_progress",
  "waiting_parts",
  "completed",
];

export const URGENCY_LABELS: Record<Urgency, string> = {
  normal: "Normal",
  urgent: "Acil",
  critical: "Kritik",
};

export const BUSINESS_LABELS: Record<BusinessType, string> = {
  hotel: "Otel",
  restaurant: "Restoran",
  cafe: "Kafe",
  industrial_kitchen: "Endüstriyel Mutfak",
  corporate: "Kurumsal",
};

export const SERVICE_MODE_LABELS: Record<ServiceMode, string> = {
  onsite: "Yerinde Servis",
  workshop: "Atölye Servisi",
};

export const DEMO_ACCOUNTS = [
  { email: "admin@pragmatechnical.com", password: "admin123", hint: "Yönetici" },
  { email: "teknik@pragmatechnical.com", password: "teknik123", hint: "Teknisyen" },
  { email: "musteri@pragmatechnical.com", password: "musteri123", hint: "Müşteri (Otel)" },
] as const;

export const MAX_FILE_SIZE = 2_500_000;
