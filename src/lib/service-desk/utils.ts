import type { ServiceStatus } from "./types";
import { STATUS_ORDER } from "./constants";

export function uid(prefix = "id") {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function nextTicketCode(tickets: { code: string }[]) {
  const year = new Date().getFullYear();
  const nums = tickets
    .map((t) => {
      const m = t.code.match(/FIX-\d{4}-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `FIX-${year}-${String(next).padStart(4, "0")}`;
}

export function statusProgress(status: ServiceStatus) {
  const idx = STATUS_ORDER.indexOf(status);
  return Math.round(((idx + 1) / STATUS_ORDER.length) * 100);
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function roleHome(role: string) {
  if (role === "admin") return "/app/admin";
  if (role === "technician") return "/app/teknik";
  return "/app/musteri";
}
