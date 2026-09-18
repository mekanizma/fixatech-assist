import type { TalepFormPdfData } from "@/lib/service-desk/pdf";
import type { CreateFormSubmissionInput, FormSubmission } from "./types";
import {
  asContactPayload,
  asTechPayload,
  deliveryLabel,
  payloadStr,
  urgencyLabel,
} from "./display";

export type TechServiceFormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  productName: string;
  brand: string;
  model: string;
  quantity: string;
  category: string;
  serialNo: string;
  issue: string;
  address: string;
  district: string;
  city: string;
  delivery: string;
  pickupDate: string;
  pickupTime: string;
  urgency: string;
  notes: string;
};

export const emptyTechServiceForm = (): TechServiceFormState => ({
  name: "",
  company: "",
  phone: "",
  email: "",
  productName: "",
  brand: "",
  model: "",
  quantity: "1",
  category: "",
  serialNo: "",
  issue: "",
  address: "",
  district: "",
  city: "",
  delivery: "onsite",
  pickupDate: "",
  pickupTime: "",
  urgency: "normal",
  notes: "",
});

export function talepFormCode(id?: string) {
  if (!id) return "TF-TASLAK";
  return `TF-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildTechServiceWhatsApp(form: TechServiceFormState) {
  return [
    "🔧 *TEKNİK SERVİS TALEBİ — PRAGMATECHNICAL*",
    "",
    `👤 *İletişim:* ${form.name}${form.company ? ` (${form.company})` : ""}`,
    `📞 *Telefon:* ${form.phone}`,
    form.email ? `📧 *E-posta:* ${form.email}` : null,
    "",
    `📦 *Ürün:* ${form.category || form.productName}`,
    form.category ? `🏷️ *Kategori:* ${form.category}` : null,
    `🔢 *Adet:* ${form.quantity}`,
    form.brand ? `🏭 *Marka:* ${form.brand}` : null,
    form.model ? `📋 *Model:* ${form.model}` : null,
    form.serialNo ? `🔖 *Seri No:* ${form.serialNo}` : null,
    "",
    `⚠️ *Arıza / Talep:*\n${form.issue}`,
    "",
    `📍 *Adres:* ${form.address}${form.district ? `\n🏘️ *İlçe:* ${form.district}` : ""}`,
    "",
    `🚚 *Teslim:* ${deliveryLabel(form.delivery)}`,
    form.pickupDate ? `📅 *Tarih:* ${form.pickupDate}` : null,
    form.pickupTime ? `🕐 *Saat:* ${form.pickupTime}` : null,
    `⏱️ *Öncelik:* ${urgencyLabel(form.urgency)}`,
    form.notes ? `\n📝 *Not:* ${form.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function techFormToCreateInput(
  form: TechServiceFormState,
  opts?: { source?: "admin" | "public"; notes?: string; status?: CreateFormSubmissionInput["status"] },
): CreateFormSubmissionInput {
  return {
    type: "tech_service",
    contactName: form.name,
    contactPhone: form.phone,
    contactEmail: form.email,
    companyName: form.company,
    summary: `${form.category || "Teknik servis"}${form.company ? ` — ${form.company}` : form.name ? ` — ${form.name}` : ""}`,
    payload: {
      ...form,
      productName: form.productName || form.category,
      source: opts?.source ?? "admin",
    },
    whatsappMessage: buildTechServiceWhatsApp(form),
    notes: opts?.notes,
    status: opts?.status,
  };
}

export function techFormToTalepPdf(form: TechServiceFormState, code?: string): TalepFormPdfData {
  return {
    code: code ?? talepFormCode(),
    createdAt: new Date().toISOString(),
    contactName: form.name,
    companyName: form.company,
    phone: form.phone,
    email: form.email,
    address: form.address,
    district: form.district,
    city: form.city,
    category: form.category,
    brand: form.brand,
    model: form.model,
    serialNo: form.serialNo,
    quantity: form.quantity,
    issue: form.issue,
    delivery: form.delivery ? deliveryLabel(form.delivery) : "",
    pickupDate: form.pickupDate,
    pickupTime: form.pickupTime,
    urgency: form.urgency ? urgencyLabel(form.urgency) : "",
    notes: form.notes,
  };
}

export function submissionToTalepPdf(submission: FormSubmission): TalepFormPdfData {
  if (submission.type === "contact") {
    const p = asContactPayload(submission.payload);
    return {
      code: talepFormCode(submission.id),
      createdAt: submission.createdAt,
      contactName: submission.contactName || p.name || "",
      companyName: submission.companyName || p.company || "",
      phone: submission.contactPhone,
      email: submission.contactEmail,
      address: "",
      district: "",
      city: "",
      category: p.service || "İletişim",
      brand: "",
      model: "",
      serialNo: "",
      quantity: "",
      issue: p.message || submission.summary,
      delivery: "",
      pickupDate: "",
      pickupTime: "",
      urgency: "",
      notes: submission.notes,
      kind: "contact",
    };
  }

  const p = asTechPayload(submission.payload);
  return {
    code: talepFormCode(submission.id),
    createdAt: submission.createdAt,
    contactName: submission.contactName || p.name || "",
    companyName: submission.companyName || p.company || "",
    phone: submission.contactPhone || p.phone || "",
    email: submission.contactEmail || p.email || "",
    address: p.address || payloadStr(submission.payload, "address"),
    district: p.district || "",
    city: p.city || "",
    category: p.category || p.productName || "",
    brand: p.brand || "",
    model: p.model || "",
    serialNo: p.serialNo || "",
    quantity: p.quantity || "",
    issue: p.issue || "",
    delivery: p.delivery ? deliveryLabel(p.delivery) : "",
    pickupDate: p.pickupDate || "",
    pickupTime: p.pickupTime || "",
    urgency: p.urgency ? urgencyLabel(p.urgency) : "",
    notes: p.notes || submission.notes,
  };
}
