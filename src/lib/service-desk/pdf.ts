import type { ServiceTicket, TicketEvent, Technician } from "./types";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
  BUSINESS_LABELS,
  SERVICE_MODE_LABELS,
} from "./constants";
import { formatDate, formatDateTime } from "./utils";
import { ADDRESS_INLINE, COMPANY } from "@/lib/site";
import { computeInvoiceTotal, formatTry } from "./pricing";

export type ServicePdfOpts = {
  events?: TicketEvent[];
  technician?: Technician | null;
};

/** Kayıt açılışı / başvuru — müşteri, adres, ürün, talep */
export function openServiceApplicationPdf(ticket: ServiceTicket, opts?: ServicePdfOpts) {
  openPrintWindow(buildApplicationHtml(ticket, opts?.technician ?? null));
}

/** İş bitimi — teslim özeti, yapılan iş, imza */
export function openDeliveryFormPdf(ticket: ServiceTicket, opts?: ServicePdfOpts) {
  openPrintWindow(buildDeliveryHtml(ticket, opts?.technician ?? null));
}

/** @deprecated Başvuru formunu açar */
export function openServiceReportPdf(ticket: ServiceTicket, opts?: ServicePdfOpts) {
  openServiceApplicationPdf(ticket, opts);
}

function openPrintWindow(html: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

function ticketContext(ticket: ServiceTicket) {
  const addressLine = [ticket.address, ticket.district, ticket.city]
    .map((s) => s?.trim())
    .filter(Boolean)
    .join(" · ");

  const productLine = [
    ticket.productType,
    ticket.productName && ticket.productName !== ticket.productType ? ticket.productName : "",
    [ticket.brand, ticket.model].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(" — ");

  const serialLine = ticket.serialNo
    ? `Seri: ${ticket.serialNo} · ${ticket.quantity} adet`
    : `${ticket.quantity} adet`;

  return { addressLine, productLine, serialLine };
}

function buildApplicationHtml(ticket: ServiceTicket, tech: Technician | null) {
  const theme = PDF_THEMES.application;
  const { addressLine, productLine, serialLine } = ticketContext(ticket);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <title>Servis Başvuru — ${esc(ticket.code)}</title>
  <style>${applicationStyles(theme)}</style>
</head>
<body class="pdf-body application">
  <div class="page">
    ${pdfDocHeader(theme, {
      docTitle: "Servis ve Başvuru Formu",
      code: ticket.code,
      status: STATUS_LABELS[ticket.status],
      chip: formatDateTime(ticket.updatedAt),
    })}

    <div class="section-label">Kayıt bilgileri</div>
    <div class="cards">
      ${infoCard("Müşteri", [
        `<p class="lead">${esc(ticket.companyName)}</p>`,
        `<p class="muted">${BUSINESS_LABELS[ticket.businessType]} · ${esc(ticket.contactPerson)}</p>`,
        `<p class="muted">${esc(ticket.phone)}${ticket.email ? ` · ${esc(ticket.email)}` : ""}</p>`,
        `<p class="highlight"><b>Randevu</b> ${formatDate(ticket.serviceDate)} · ${esc(ticket.serviceTime || "—")}</p>`,
      ])}
      ${infoCard("Adres", [`<p>${esc(addressLine || "—")}</p>`])}
      ${infoCard("Ürün", [
        `<p class="lead">${esc(productLine || "—")}</p>`,
        `<p class="muted">${esc(serialLine)}</p>`,
      ])}
      ${infoCard("Müşteri talepleri", [
        `<p>${esc(ticket.issueDescription || "—")}</p>`,
        ticket.notes ? `<p class="muted">Not: ${esc(shorten(ticket.notes, 130))}</p>` : "",
      ])}
    </div>

    <div class="meta-bar">
      <span><b>Öncelik</b> ${URGENCY_LABELS[ticket.urgency]}</span>
      <span><b>Servis</b> ${SERVICE_MODE_LABELS[ticket.serviceMode]}</span>
      <span><b>Teknisyen</b> ${tech ? esc(tech.name) : "Atanmadı"}</span>
      <span><b>Başvuru</b> ${formatDate(ticket.createdAt)}</span>
    </div>

    ${blankWorkSection(theme)}
    <p class="legal">Bu form servis başvurusu ve ürün kabul kaydı içindir. İmza ile onaylanır.</p>
    <div class="signatures">
      ${signatureCard("Kabul", "Teknisyen")}
      ${signatureCard("Onay", "Müşteri / yetkili")}
    </div>

    <footer class="page-foot">
      <strong>${COMPANY}</strong> Endüstriyel Teknik Servis · ${ADDRESS_INLINE}
      <span class="dot">·</span> ${new Date().toLocaleDateString("tr-TR")}
    </footer>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}

function buildDeliveryHtml(ticket: ServiceTicket, _tech: Technician | null) {
  const theme = PDF_THEMES.delivery;
  const { addressLine, productLine, serialLine } = ticketContext(ticket);
  const deliveryDate =
    ticket.status === "completed" ? formatDate(ticket.updatedAt) : formatDate(new Date().toISOString());
  const workSummary = ticket.workPerformed
    ? esc(shorten(ticket.workPerformed.replace(/\s+/g, " "), 200))
    : "—";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <title>Teslim Formu — ${esc(ticket.code)}</title>
  <style>${deliveryStyles(theme)}</style>
</head>
<body class="pdf-body delivery">
  <div class="page">
    ${pdfDocHeader(theme, {
      docTitle: "Teslim Formu",
      code: ticket.code,
      status: STATUS_LABELS[ticket.status],
      chip: `Teslim · ${deliveryDate}`,
    })}

    <div class="cards">
      ${infoCard("Müşteri", [
        `<p class="lead">${esc(ticket.companyName)}</p>`,
        `<p>${esc(ticket.contactPerson)}</p>`,
        `<p class="muted">${esc(ticket.phone)}</p>`,
      ])}
      ${infoCard("Adres", [`<p>${esc(shorten(addressLine || "—", 85))}</p>`])}
      ${infoCard("Ürün", [
        `<p class="lead">${esc(shorten(productLine || "—", 72))}</p>`,
        `<p class="muted">${esc(serialLine)}</p>`,
      ])}
      ${infoCard("İşlem özeti", [`<p class="muted">${workSummary}</p>`])}
    </div>

    ${buildPricingBlock(ticket, theme)}

    <div class="confirm">
      <p class="confirm-title">Müşteri onayı</p>
      <div class="confirm-items">
        <span class="check-item"><i></i> Ürün çalışır durumda teslim edildi</span>
        <span class="check-item"><i></i> Yapılan işlemler bildirildi</span>
        <span class="check-item"><i></i> Garanti koşulları anlatıldı</span>
      </div>
      <p class="confirm-note">Ürün eksiksiz teslim alınmış / edilmiştir. İmza ile onaylanır.</p>
    </div>

    <div class="signatures">
      ${signatureCard("Teslim eden", "Teknisyen")}
      ${signatureCard("Teslim alan", "Müşteri / yetkili")}
    </div>

    <footer class="page-foot">
      <strong>${COMPANY}</strong> Endüstriyel Teknik Servis · ${ADDRESS_INLINE}
      <span class="dot">·</span> ${new Date().toLocaleDateString("tr-TR")}
    </footer>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}

const PDF_THEMES = {
  application: {
    accent: "#1d4ed8",
    accentDark: "#1e3a8a",
    accentLight: "#eff6ff",
    accentSoft: "#dbeafe",
  },
  delivery: {
    accent: "#047857",
    accentDark: "#065f46",
    accentLight: "#ecfdf5",
    accentSoft: "#d1fae5",
  },
} as const;

type PdfTheme = (typeof PDF_THEMES)[keyof typeof PDF_THEMES];

function pdfSharedStyles(theme: PdfTheme, compact: boolean) {
  const pad = compact ? "0" : "10mm";
  const fs = compact ? "8.5pt" : "10pt";
  return `
    @page { size: A4 portrait; margin: ${compact ? "7mm" : "12mm"}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body.pdf-body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      font-size: ${fs};
      line-height: 1.35;
      background: #f1f5f9;
    }
    body.pdf-body { padding: ${pad}; }
    .page {
      max-width: ${compact ? "194mm" : "180mm"};
      margin: 0 auto;
      background: #fff;
      border-radius: ${compact ? "6px" : "12px"};
      border: 1px solid ${theme.accentSoft};
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: ${compact ? "6px" : "10px"};
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      gap: 12px;
      padding: ${compact ? "10px 12px" : "16px 20px"};
      background: linear-gradient(135deg, ${theme.accentDark} 0%, ${theme.accent} 100%);
      color: #fff;
    }
    .brand-block { display: flex; align-items: center; gap: 10px; }
    .brand-mark {
      width: ${compact ? "32px" : "40px"};
      height: ${compact ? "32px" : "40px"};
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: ${compact ? "14px" : "18px"};
      letter-spacing: -0.02em;
    }
    .brand-name { font-size: ${compact ? "13pt" : "16pt"}; font-weight: 800; letter-spacing: 0.02em; }
    .brand-tag { font-size: ${compact ? "7pt" : "8pt"}; opacity: 0.85; margin-top: 1px; }
    .doc-meta { text-align: right; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
    .doc-type { font-size: ${compact ? "8pt" : "9pt"}; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.9; }
    .doc-code { font-size: ${compact ? "11pt" : "13pt"}; font-weight: 700; }
    .chips { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px; margin-top: 2px; }
    .chip {
      font-size: ${compact ? "6.5pt" : "7.5pt"};
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      font-weight: 600;
    }
    .section-label {
      font-size: ${compact ? "6.5pt" : "7.5pt"};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: ${theme.accent};
      padding: 0 ${compact ? "12px" : "20px"};
      margin-top: 2px;
    }
    .cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${compact ? "6px" : "8px"};
      padding: 0 ${compact ? "10px" : "16px"};
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: ${compact ? "6px 8px" : "10px 12px"};
      background: #fafafa;
      border-left: 3px solid ${theme.accent};
    }
    .card h4 {
      font-size: ${compact ? "6pt" : "7pt"};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${theme.accent};
      font-weight: 700;
      margin-bottom: 4px;
    }
    .card p { font-size: ${compact ? "7.5pt" : "9pt"}; color: #334155; }
    .card p + p { margin-top: 2px; }
    .card .lead { font-weight: 600; color: #0f172a; }
    .card .muted { color: #64748b; font-size: ${compact ? "7pt" : "8pt"}; }
    .card .highlight {
      margin-top: 4px;
      padding: 3px 6px;
      background: ${theme.accentLight};
      border-radius: 4px;
      font-size: ${compact ? "7pt" : "8pt"};
      color: ${theme.accentDark};
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
      margin: 0 ${compact ? "10px" : "16px"};
      padding: ${compact ? "6px 10px" : "8px 12px"};
      background: ${theme.accentLight};
      border-radius: 6px;
      font-size: ${compact ? "7pt" : "8pt"};
      color: #334155;
    }
    .meta-bar b { color: ${theme.accentDark}; font-weight: 700; }
    .pricing-block {
      margin: 0 ${compact ? "10px" : "16px"};
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .pricing-head {
      padding: ${compact ? "5px 10px" : "8px 14px"};
      background: ${theme.accentLight};
      border-bottom: 1px solid ${theme.accentSoft};
      font-size: ${compact ? "7pt" : "8pt"};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${theme.accentDark};
    }
    .pricing-cols { display: grid; grid-template-columns: 1fr 1fr; }
    .pricing-col { padding: ${compact ? "6px 8px" : "10px 12px"}; }
    .pricing-col + .pricing-col { border-left: 1px solid #e2e8f0; }
    .pricing-col h5 {
      font-size: ${compact ? "6pt" : "7pt"};
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
      letter-spacing: 0.06em;
    }
    table.data { width: 100%; border-collapse: collapse; font-size: ${compact ? "7pt" : "8.5pt"}; }
    table.data tr:nth-child(even) td { background: #f8fafc; }
    table.data td { padding: ${compact ? "2px 4px" : "4px 6px"}; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    table.data td.amt { text-align: right; font-weight: 700; color: #0f172a; white-space: nowrap; width: 32%; }
    table.data .empty { color: #94a3b8; font-style: italic; }
    table.data .muted { color: #94a3b8; font-size: 0.95em; }
    .pricing-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px 20px;
      padding: ${compact ? "6px 10px" : "10px 14px"};
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: ${compact ? "7.5pt" : "9pt"};
    }
    .pricing-footer .sum { color: #64748b; }
    .pricing-footer .sum b { color: #334155; }
    .grand-total {
      padding: ${compact ? "4px 12px" : "6px 16px"};
      background: ${theme.accent};
      color: #fff;
      border-radius: 6px;
      font-weight: 700;
      font-size: ${compact ? "8.5pt" : "10pt"};
    }
    .confirm {
      margin: 0 ${compact ? "10px" : "16px"};
      padding: ${compact ? "8px 10px" : "12px 14px"};
      background: ${theme.accentLight};
      border: 1px solid ${theme.accentSoft};
      border-radius: 8px;
    }
    .confirm-title {
      font-size: ${compact ? "7pt" : "8pt"};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${theme.accentDark};
      margin-bottom: 6px;
    }
    .confirm-items { display: flex; flex-wrap: wrap; gap: 4px 14px; }
    .check-item {
      font-size: ${compact ? "7pt" : "8pt"};
      color: #475569;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .check-item i {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1.5px solid ${theme.accent};
      border-radius: 2px;
      flex-shrink: 0;
    }
    .confirm-note { font-size: ${compact ? "6.5pt" : "7.5pt"}; color: #64748b; margin-top: 6px; }
    .legal { font-size: ${compact ? "7pt" : "8pt"}; color: #64748b; margin: 0 ${compact ? "10px" : "16px"}; }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${compact ? "10px" : "16px"};
      padding: 0 ${compact ? "10px" : "16px"} ${compact ? "8px" : "12px"};
    }
    .sign-card {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: ${compact ? "8px 10px" : "12px 14px"};
      background: #fff;
    }
    .sign-card .role {
      font-size: ${compact ? "6.5pt" : "7pt"};
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      font-weight: 600;
    }
    .sign-card .who {
      font-size: ${compact ? "8pt" : "9pt"};
      font-weight: 600;
      color: #334155;
      margin: 2px 0 8px;
    }
    .sign-card .line {
      border-bottom: 1.5px solid #94a3b8;
      height: ${compact ? "24px" : "32px"};
    }
    .sign-card .hint { font-size: ${compact ? "6pt" : "7pt"}; color: #94a3b8; margin-top: 4px; }
    .work-blank {
      margin: 0 ${compact ? "10px" : "16px"};
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .work-blank-head {
      display: flex;
      justify-content: space-between;
      padding: ${compact ? "5px 10px" : "8px 12px"};
      background: ${theme.accentLight};
      border-bottom: 1px solid ${theme.accentSoft};
    }
    .work-blank-head h3 {
      font-size: ${compact ? "7pt" : "8pt"};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${theme.accentDark};
      font-weight: 700;
    }
    .work-blank-head span { font-size: ${compact ? "6.5pt" : "7pt"}; color: #94a3b8; font-style: italic; }
    .work-blank-body { padding: ${compact ? "6px 10px 8px" : "10px 12px 12px"}; }
    .work-blank-line {
      border-bottom: 1px solid #cbd5e1;
      height: ${compact ? "20px" : "26px"};
      margin-top: 4px;
    }
    .page-foot {
      text-align: center;
      font-size: ${compact ? "6.5pt" : "7.5pt"};
      color: #94a3b8;
      padding: ${compact ? "8px 10px" : "12px 16px"};
      border-top: 1px solid #e2e8f0;
      background: #fafafa;
    }
    .page-foot strong { color: ${theme.accentDark}; }
    .page-foot .dot { margin: 0 4px; }
    @media print {
      html, body.pdf-body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body.pdf-body { padding: 0; }
      .page { box-shadow: none; border-radius: 0; border: none; max-width: none; page-break-inside: avoid; break-inside: avoid; }
      .doc-header, .pricing-block, .confirm, .signatures { break-inside: avoid; page-break-inside: avoid; }
    }
  `;
}

function applicationStyles(theme: PdfTheme) {
  return pdfSharedStyles(theme, false);
}

function deliveryStyles(theme: PdfTheme) {
  return pdfSharedStyles(theme, true);
}

function pdfDocHeader(
  theme: PdfTheme,
  opts: { docTitle: string; code: string; status: string; chip: string },
) {
  return `<header class="doc-header">
    <div class="brand-block">
      <div class="brand-mark">P</div>
      <div>
        <div class="brand-name">${COMPANY}</div>
        <div class="brand-tag">Endüstriyel Teknik Servis</div>
      </div>
    </div>
    <div class="doc-meta">
      <div class="doc-type">${esc(opts.docTitle)}</div>
      <div class="doc-code">${esc(opts.code)}</div>
      <div class="chips">
        <span class="chip">${esc(opts.status)}</span>
        <span class="chip">${esc(opts.chip)}</span>
      </div>
    </div>
  </header>`;
}

function infoCard(title: string, lines: string[]) {
  return `<article class="card"><h4>${esc(title)}</h4>${lines.filter(Boolean).join("")}</article>`;
}

function signatureCard(role: string, who: string) {
  return `<div class="sign-card">
    <div class="role">${esc(role)}</div>
    <div class="who">${esc(who)}</div>
    <div class="line"></div>
    <div class="hint">İmza</div>
  </div>`;
}

function buildPricingBlock(ticket: ServiceTicket, theme: PdfTheme) {
  const workItems = ticket.workItems ?? [];
  const parts = ticket.partsUsed ?? [];
  const laborTotal = workItems.reduce((s, w) => s + (Number(w.amount) || 0), 0);
  const partsTotal = parts.reduce((s, p) => s + (Number(p.cost) || 0), 0);
  const grand = ticket.invoiceAmount ?? computeInvoiceTotal(workItems, parts);

  const laborRows = workItems.length
    ? workItems
        .map(
          (w) =>
            `<tr><td>${esc(shorten(w.description, 50))}</td><td class="amt">${esc(formatTry(Number(w.amount) || 0))}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="2" class="empty">Kalem girilmedi</td></tr>`;

  const partRows = parts.length
    ? parts
        .map(
          (p) =>
            `<tr><td>${esc(shorten(p.name, 42))} <span class="muted">× ${p.qty}</span></td><td class="amt">${esc(formatTry(Number(p.cost) || 0))}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="2" class="empty">Parça yok</td></tr>`;

  return `<section class="pricing-block">
    <div class="pricing-head">Fiyatlandırma detayı</div>
    <div class="pricing-cols">
      <div class="pricing-col">
        <h5>Yapılan işlemler</h5>
        <table class="data"><tbody>${laborRows}</tbody></table>
      </div>
      <div class="pricing-col">
        <h5>Parça &amp; malzeme</h5>
        <table class="data"><tbody>${partRows}</tbody></table>
      </div>
    </div>
    <div class="pricing-footer">
      <span class="sum">İşçilik: <b>${esc(formatTry(laborTotal))}</b></span>
      <span class="sum">Parça: <b>${esc(formatTry(partsTotal))}</b></span>
      <span class="grand-total">Genel toplam ${esc(formatTry(grand))}</span>
    </div>
  </section>`;
}

function blankWorkSection(theme: PdfTheme) {
  const lines = Array.from({ length: 5 }, () => `<div class="work-blank-line"></div>`).join("");
  return `<section class="work-blank">
    <div class="work-blank-head">
      <h3>Yapılan işlem</h3>
      <span>Elle doldurulacaktır</span>
    </div>
    <div class="work-blank-body">${lines}</div>
  </section>`;
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shorten(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
