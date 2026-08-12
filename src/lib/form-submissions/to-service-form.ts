import { PRODUCT_TYPES, TIME_SLOTS } from "@/lib/service-desk/constants";
import type { ServiceFormValues } from "@/components/service-desk/ServiceRequestForm";
import type { ServiceMode, Urgency } from "@/lib/service-desk/types";
import type { FormSubmission } from "./types";
import { asTechPayload, payloadStr } from "./display";

function mapUrgency(value: string): Urgency {
  if (value === "emergency") return "critical";
  if (value === "urgent") return "urgent";
  return "normal";
}

function mapServiceMode(delivery: string): ServiceMode {
  if (delivery === "onsite") return "onsite";
  return "workshop";
}

function mapProductType(category: string): string {
  if (!category) return PRODUCT_TYPES[0];
  const c = category.toLowerCase();
  const exact = PRODUCT_TYPES.find((p) => p.toLowerCase() === c);
  if (exact) return exact;
  if (c.includes("soğut") || c.includes("buz")) return "Buzdolabı";
  if (c.includes("elektrik") || c.includes("elektronik")) return "Elektrik Sistemi";
  if (c.includes("su") || c.includes("tesisat") || c.includes("pompa")) return "Su Tesisatı";
  if (c.includes("mutfak") || c.includes("fırın") || c.includes("konveksiyon")) return "Endüstriyel Fırın";
  if (c.includes("kahve")) return "Kahve Makinesi";
  if (c.includes("bulaşık")) return "Bulaşık Makinesi";
  if (c.includes("klima") || c.includes("havalandırma")) return "Diğer";
  if (c.includes("tamirat") || c.includes("genel")) return "Diğer";
  return "Diğer";
}

function mapTimeSlot(raw: string): string {
  if (!raw) return TIME_SLOTS[1];
  const normalized = raw.replace(/-/g, "–").trim();
  const match = TIME_SLOTS.find((s) => s === normalized || s.includes(normalized.slice(0, 5)));
  return match ?? TIME_SLOTS[1];
}

/** Public talep formu → panel servis kaydı formu */
export function submissionToServiceForm(submission: FormSubmission): Partial<ServiceFormValues> {
  if (submission.type !== "tech_service") {
    return {
      contactPerson: submission.contactName,
      companyName: submission.companyName || submission.contactName,
      phone: submission.contactPhone,
      email: submission.contactEmail,
      issueDescription: submission.summary,
      notes: submission.notes ? `Talep formu notu: ${submission.notes}` : "",
    };
  }

  const p = asTechPayload(submission.payload);
  const qty = Number.parseInt(String(p.quantity ?? "1"), 10);

  return {
    companyName: payloadStr(submission.payload, "company") || payloadStr(submission.payload, "name") || submission.contactName,
    contactPerson: payloadStr(submission.payload, "name") || submission.contactName,
    phone: payloadStr(submission.payload, "phone") || submission.contactPhone,
    email: payloadStr(submission.payload, "email") || submission.contactEmail,
    address: payloadStr(submission.payload, "address"),
    district: payloadStr(submission.payload, "district"),
    city: payloadStr(submission.payload, "city"),
    businessType: "corporate",
    productType: mapProductType(payloadStr(submission.payload, "category")),
    productName:
      payloadStr(submission.payload, "productName") ||
      payloadStr(submission.payload, "category") ||
      mapProductType(payloadStr(submission.payload, "category")),
    brand: payloadStr(submission.payload, "brand"),
    model: payloadStr(submission.payload, "model"),
    serialNo: payloadStr(submission.payload, "serialNo"),
    quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
    issueDescription: payloadStr(submission.payload, "issue"),
    urgency: mapUrgency(payloadStr(submission.payload, "urgency")),
    serviceDate: payloadStr(submission.payload, "pickupDate") || new Date().toISOString().split("T")[0],
    serviceTime: mapTimeSlot(payloadStr(submission.payload, "pickupTime")),
    serviceMode: mapServiceMode(payloadStr(submission.payload, "delivery")),
    notes: [payloadStr(submission.payload, "notes"), submission.notes ? `(Form: ${submission.notes})` : ""]
      .filter(Boolean)
      .join("\n"),
    warrantyStatus: "unknown",
    previousService: false,
  };
}
