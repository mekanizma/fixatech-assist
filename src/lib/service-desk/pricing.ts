import type { PartUsed, WorkLineItem } from "./types";

export function formatTry(amount: number) {
  return `${amount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}

export function computeInvoiceTotal(
  workItems?: WorkLineItem[],
  partsUsed?: PartUsed[],
): number {
  const labor = (workItems ?? []).reduce((s, w) => s + (Number(w.amount) || 0), 0);
  const parts = (partsUsed ?? []).reduce((s, p) => s + (Number(p.cost) || 0), 0);
  return Math.round((labor + parts) * 100) / 100;
}

export function workPerformedSummary(note: string, items: WorkLineItem[]): string {
  const lines = items
    .filter((i) => i.description.trim())
    .map((i) => {
      const amt = Number(i.amount) || 0;
      return amt > 0 ? `${i.description.trim()} — ${formatTry(amt)}` : i.description.trim();
    });
  if (lines.length) return lines.join("\n");
  return note.trim();
}

export function emptyWorkItem(): WorkLineItem {
  return { description: "", amount: 0 };
}

export function emptyPart(): PartUsed {
  return { name: "", qty: 1, cost: 0 };
}
