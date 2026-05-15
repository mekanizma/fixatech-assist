import type { ServiceTicket, TicketEvent, Technician } from "./types";
import { STATUS_LABELS, URGENCY_LABELS, BUSINESS_LABELS } from "./constants";
import { formatDate, formatDateTime } from "./utils";
import { ADDRESS_INLINE } from "@/lib/site";

export function openServiceReportPdf(
  ticket: ServiceTicket,
  opts?: { events?: TicketEvent[]; technician?: Technician | null },
) {
  const tech = opts?.technician ?? null;
  const events = opts?.events ?? [];

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <title>Servis Raporu — ${ticket.code}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a2332; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 28px; }
    .brand { font-size: 22px; font-weight: 700; color: #1e40af; }
    .code { font-size: 14px; color: #64748b; margin-top: 4px; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 24px 0 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    td:first-child { font-weight: 600; width: 38%; color: #475569; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #dbeafe; color: #1d4ed8; }
    .timeline { list-style: none; }
    .timeline li { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .timeline time { color: #94a3b8; font-size: 11px; display: block; margin-bottom: 2px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">FİXATECH</div>
      <div>Endüstriyel Teknik Servis Raporu</div>
      <div class="code">${ticket.code}</div>
    </div>
    <div style="text-align:right">
      <div class="badge">${STATUS_LABELS[ticket.status]}</div>
      <div style="margin-top:8px;font-size:12px;color:#64748b">${formatDateTime(ticket.updatedAt)}</div>
    </div>
  </div>

  <h2>Firma Bilgileri</h2>
  <table>
    <tr><td>Firma</td><td>${esc(ticket.companyName)} (${BUSINESS_LABELS[ticket.businessType]})</td></tr>
    <tr><td>Yetkili</td><td>${esc(ticket.contactPerson)}</td></tr>
    <tr><td>Telefon</td><td>${esc(ticket.phone)}</td></tr>
    <tr><td>E-posta</td><td>${esc(ticket.email)}</td></tr>
    <tr><td>Adres</td><td>${esc(ticket.address)}, ${esc(ticket.district)} / ${esc(ticket.city)}</td></tr>
  </table>

  <h2>Ürün & Arıza</h2>
  <table>
    <tr><td>Ürün</td><td>${esc(ticket.productName)} — ${esc(ticket.productType)}</td></tr>
    <tr><td>Marka / Model</td><td>${esc(ticket.brand)} ${esc(ticket.model)}</td></tr>
    <tr><td>Seri No</td><td>${esc(ticket.serialNo || "—")}</td></tr>
    <tr><td>Adet</td><td>${ticket.quantity}</td></tr>
    <tr><td>Öncelik</td><td>${URGENCY_LABELS[ticket.urgency]}</td></tr>
    <tr><td>Arıza</td><td>${esc(ticket.issueDescription)}</td></tr>
    <tr><td>Servis</td><td>${formatDate(ticket.serviceDate)} — ${esc(ticket.serviceTime)}</td></tr>
    <tr><td>Teknisyen</td><td>${tech ? esc(tech.name) : "Atanmadı"}</td></tr>
  </table>

  ${
    ticket.workPerformed
      ? `<h2>Yapılan İşlemler</h2><p style="font-size:14px;line-height:1.6">${esc(ticket.workPerformed)}</p>`
      : ""
  }

  ${
    ticket.partsUsed?.length
      ? `<h2>Kullanılan Parçalar</h2><table>${ticket.partsUsed
          .map(
            (p) =>
              `<tr><td>${esc(p.name)}</td><td>${p.qty} adet${p.cost ? ` — ${p.cost.toLocaleString("tr-TR")} ₺` : ""}</td></tr>`,
          )
          .join("")}</table>`
      : ""
  }

  <h2>Servis Geçmişi</h2>
  <ul class="timeline">
    ${events
      .map(
        (e) =>
          `<li><time>${formatDateTime(e.createdAt)} — ${esc(e.createdByName)}</time>${esc(e.message)}</li>`,
      )
      .join("")}
  </ul>

  <div class="footer">
    FİXATECH Endüstriyel Teknik Servis · ${ADDRESS_INLINE} · ${new Date().toLocaleDateString("tr-TR")} · Bu belge dijital olarak oluşturulmuştur.
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
