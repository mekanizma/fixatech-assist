import { formatTry } from "@/lib/service-desk/pricing";
import type { TeklifFormPdfData, TeklifLineItemPdf } from "@/lib/service-desk/pdf";
import type { CreateFormSubmissionInput, FormSubmission } from "./types";

export type TeklifLineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

export type TeklifFormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  title: string;
  validUntil: string;
  notes: string;
  terms: string;
  items: TeklifLineItem[];
};

export const emptyTeklifLine = (): TeklifLineItem => ({
  description: "",
  quantity: "1",
  unitPrice: "",
});

export const emptyTeklifForm = (): TeklifFormState => ({
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  district: "",
  city: "",
  title: "Teknik servis / bakım teklifi",
  validUntil: "",
  notes: "",
  terms: "Fiyatlar KDV hariçtir. Teklif, belirtilen geçerlilik tarihine kadar geçerlidir.",
  items: [emptyTeklifLine(), emptyTeklifLine(), emptyTeklifLine()],
});

export function teklifFormCode(id?: string) {
  if (!id) return "TK-TASLAK";
  return `TK-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function lineAmount(item: TeklifLineItem): number {
  const qty = Number(item.quantity) || 0;
  const price = Number(String(item.unitPrice).replace(",", ".")) || 0;
  return Math.round(qty * price * 100) / 100;
}

export function teklifGrandTotal(items: TeklifLineItem[]): number {
  return Math.round(items.reduce((s, i) => s + lineAmount(i), 0) * 100) / 100;
}

function filledItems(items: TeklifLineItem[]) {
  return items.filter((i) => i.description.trim());
}

export function buildTeklifWhatsApp(form: TeklifFormState) {
  const items = filledItems(form.items);
  const total = teklifGrandTotal(items);
  return [
    "📋 *TEKLİF — PRAGMATECHNICAL*",
    "",
    `👤 *İletişim:* ${form.name}${form.company ? ` (${form.company})` : ""}`,
    form.phone ? `📞 *Telefon:* ${form.phone}` : null,
    form.email ? `📧 *E-posta:* ${form.email}` : null,
    "",
    `📌 *Konu:* ${form.title || "Teklif"}`,
    form.validUntil ? `📅 *Geçerlilik:* ${form.validUntil}` : null,
    "",
    "*Kalemler:*",
    ...items.map(
      (i, idx) =>
        `${idx + 1}. ${i.description.trim()} — ${i.quantity} × ${i.unitPrice || "0"} = ${formatTry(lineAmount(i))}`,
    ),
    items.length ? "" : "—",
    `💰 *Toplam:* ${formatTry(total)}`,
    form.notes ? `\n📝 *Not:* ${form.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function teklifFormToCreateInput(
  form: TeklifFormState,
  opts?: { source?: "admin" | "public"; notes?: string; status?: CreateFormSubmissionInput["status"] },
): CreateFormSubmissionInput {
  const items = filledItems(form.items);
  const total = teklifGrandTotal(items);
  return {
    type: "quote",
    contactName: form.name,
    contactPhone: form.phone,
    contactEmail: form.email,
    companyName: form.company,
    summary: `${form.title || "Teklif"}${form.company ? ` — ${form.company}` : form.name ? ` — ${form.name}` : ""}${total > 0 ? ` · ${formatTry(total)}` : ""}`,
    payload: {
      ...form,
      items,
      grandTotal: total,
      source: opts?.source ?? "admin",
    },
    whatsappMessage: buildTeklifWhatsApp(form),
    notes: opts?.notes,
    status: opts?.status,
  };
}

function toPdfItems(items: TeklifLineItem[]): TeklifLineItemPdf[] {
  return filledItems(items).map((i) => ({
    description: i.description.trim(),
    quantity: i.quantity,
    unitPrice: Number(String(i.unitPrice).replace(",", ".")) || 0,
    amount: lineAmount(i),
  }));
}

export function teklifFormToPdf(form: TeklifFormState, code?: string): TeklifFormPdfData {
  const items = toPdfItems(form.items);
  return {
    code: code ?? teklifFormCode(),
    createdAt: new Date().toISOString(),
    contactName: form.name,
    companyName: form.company,
    phone: form.phone,
    email: form.email,
    address: form.address,
    district: form.district,
    city: form.city,
    title: form.title,
    validUntil: form.validUntil,
    notes: form.notes,
    terms: form.terms,
    items,
    grandTotal: teklifGrandTotal(form.items),
  };
}

export function submissionToTeklifPdf(submission: FormSubmission): TeklifFormPdfData {
  const p = submission.payload;
  const rawItems = Array.isArray(p.items) ? (p.items as TeklifLineItem[]) : [];
  const items = toPdfItems(rawItems);
  const grandTotal =
    typeof p.grandTotal === "number" ? p.grandTotal : teklifGrandTotal(rawItems);

  return {
    code: teklifFormCode(submission.id),
    createdAt: submission.createdAt,
    contactName: submission.contactName || String(p.name ?? ""),
    companyName: submission.companyName || String(p.company ?? ""),
    phone: submission.contactPhone || String(p.phone ?? ""),
    email: submission.contactEmail || String(p.email ?? ""),
    address: String(p.address ?? ""),
    district: String(p.district ?? ""),
    city: String(p.city ?? ""),
    title: String(p.title ?? submission.summary),
    validUntil: String(p.validUntil ?? ""),
    notes: String(p.notes ?? "") || submission.notes,
    terms: String(p.terms ?? ""),
    items,
    grandTotal,
  };
}
