import { SEED_DATA } from "./seed";
import { STORAGE_KEY, STATUS_LABELS } from "./constants";
import { nextTicketCode, uid } from "./utils";
import type {
  ServiceDeskData,
  ServiceTicket,
  ServiceStatus,
  TicketEvent,
  TicketInput,
  User,
  Technician,
  Company,
} from "./types";

const SERVER_SNAPSHOT = structuredClone(SEED_DATA);

function readFromStorage(): ServiceDeskData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return structuredClone(SEED_DATA);
    }
    return JSON.parse(raw) as ServiceDeskData;
  } catch {
    return structuredClone(SEED_DATA);
  }
}

let clientSnapshot: ServiceDeskData =
  typeof window === "undefined" ? SERVER_SNAPSHOT : readFromStorage();

function refreshClientSnapshot() {
  if (typeof window === "undefined") return;
  clientSnapshot = readFromStorage();
}

function save(data: ServiceDeskData) {
  if (typeof window === "undefined") return;
  clientSnapshot = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("fixatech-desk-update"));
}

/** Stable reference for useSyncExternalStore — only changes after save/subscribe. */
export function getData(): ServiceDeskData {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return clientSnapshot;
}

export function getServerSnapshot(): ServiceDeskData {
  return SERVER_SNAPSHOT;
}

function load(): ServiceDeskData {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  refreshClientSnapshot();
  return clientSnapshot;
}

export function resetData() {
  save(structuredClone(SEED_DATA));
}

export function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    refreshClientSnapshot();
    cb();
  };
  window.addEventListener("fixatech-desk-update", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("fixatech-desk-update", handler);
    window.removeEventListener("storage", handler);
  };
}

export function findUserByEmail(email: string): User | undefined {
  return load().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUser(id: string) {
  return load().users.find((u) => u.id === id);
}

export function getTicket(id: string) {
  return load().tickets.find((t) => t.id === id);
}

export function getTicketByCode(code: string) {
  return load().tickets.find((t) => t.code.toUpperCase() === code.toUpperCase());
}

export function getTicketEvents(ticketId: string) {
  return load()
    .events.filter((e) => e.ticketId === ticketId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getTechnician(id: string) {
  return load().technicians.find((t) => t.id === id);
}

export function getCompany(id: string) {
  return load().companies.find((c) => c.id === id);
}

function addEvent(
  data: ServiceDeskData,
  partial: Omit<TicketEvent, "id" | "createdAt">,
) {
  data.events.push({
    ...partial,
    id: uid("ev"),
    createdAt: new Date().toISOString(),
  });
}

export function createTicket(input: TicketInput, actor: { id: string; name: string }) {
  const data = load();
  const id = uid("tk");
  const code = nextTicketCode(data.tickets);
  const now = new Date().toISOString();
  const ticket: ServiceTicket = {
    ...input,
    id,
    code,
    status: "pending",
    createdByUserId: input.createdByUserId ?? actor.id,
    createdAt: now,
    updatedAt: now,
  };
  data.tickets.unshift(ticket);
  addEvent(data, {
    ticketId: id,
    type: "status",
    message: "Servis kaydı oluşturuldu — Beklemede",
    createdBy: actor.id,
    createdByName: actor.name,
  });
  save(data);
  return ticket;
}

export function updateTicketStatus(
  ticketId: string,
  status: ServiceStatus,
  actor: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  addEvent(data, {
    ticketId,
    type: "status",
    message: `Durum güncellendi: ${STATUS_LABELS[status]}`,
    createdBy: actor.id,
    createdByName: actor.name,
    meta: { status },
  });
  save(data);
}

export function assignTechnician(
  ticketId: string,
  technicianId: string,
  actor: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  const tech = data.technicians.find((t) => t.id === technicianId);
  if (!ticket || !tech) return;
  ticket.assignedTechnicianId = technicianId;
  ticket.status = ticket.status === "pending" ? "assigned" : ticket.status;
  ticket.updatedAt = new Date().toISOString();
  addEvent(data, {
    ticketId,
    type: "assignment",
    message: `${tech.name} atandı`,
    createdBy: actor.id,
    createdByName: actor.name,
    meta: { technicianId },
  });
  save(data);
}

export function addTicketNote(
  ticketId: string,
  message: string,
  actor: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  ticket.updatedAt = new Date().toISOString();
  addEvent(data, {
    ticketId,
    type: "note",
    message,
    createdBy: actor.id,
    createdByName: actor.name,
  });
  save(data);
}

export function updateTicket(
  ticketId: string,
  patch: Partial<ServiceTicket>,
  actor?: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  Object.assign(ticket, patch, { updatedAt: new Date().toISOString() });
  if (patch.workPerformed && actor) {
    addEvent(data, {
      ticketId,
      type: "work",
      message: patch.workPerformed,
      createdBy: actor.id,
      createdByName: actor.name,
    });
  }
  save(data);
}

export function completeTicket(
  ticketId: string,
  payload: {
    workPerformed: string;
    partsUsed?: ServiceTicket["partsUsed"];
    technicianSignature?: string;
    customerSignature?: string;
    invoiceAmount?: number;
  },
  actor: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  ticket.status = "completed";
  ticket.workPerformed = payload.workPerformed;
  ticket.partsUsed = payload.partsUsed;
  ticket.technicianSignature = payload.technicianSignature;
  ticket.customerSignature = payload.customerSignature;
  ticket.invoiceAmount = payload.invoiceAmount;
  ticket.updatedAt = new Date().toISOString();
  addEvent(data, {
    ticketId,
    type: "status",
    message: "Servis tamamlandı",
    createdBy: actor.id,
    createdByName: actor.name,
  });
  if (payload.workPerformed) {
    addEvent(data, {
      ticketId,
      type: "work",
      message: payload.workPerformed,
      createdBy: actor.id,
      createdByName: actor.name,
    });
  }
  save(data);
}

export function addTicketPhoto(
  ticketId: string,
  dataUrl: string,
  actor: { id: string; name: string },
) {
  const data = load();
  const ticket = data.tickets.find((t) => t.id === ticketId);
  if (!ticket) return;
  ticket.photos = [...ticket.photos, dataUrl];
  ticket.updatedAt = new Date().toISOString();
  addEvent(data, {
    ticketId,
    type: "photo",
    message: "Fotoğraf eklendi",
    createdBy: actor.id,
    createdByName: actor.name,
  });
  save(data);
}

export function upsertCompany(company: Company) {
  const data = load();
  const idx = data.companies.findIndex((c) => c.id === company.id);
  if (idx >= 0) data.companies[idx] = company;
  else data.companies.push(company);
  save(data);
}

export function upsertTechnician(tech: Technician) {
  const data = load();
  const idx = data.technicians.findIndex((t) => t.id === tech.id);
  if (idx >= 0) data.technicians[idx] = tech;
  else data.technicians.push(tech);
  save(data);
}

export function getDashboardStats() {
  const data = load();
  const today = new Date().toISOString().split("T")[0];
  return {
    total: data.tickets.length,
    today: data.tickets.filter((t) => t.serviceDate === today).length,
    pending: data.tickets.filter((t) => t.status === "pending").length,
    critical: data.tickets.filter((t) => t.urgency === "critical" && t.status !== "completed").length,
    inProgress: data.tickets.filter((t) =>
      ["assigned", "en_route", "in_progress", "waiting_parts"].includes(t.status),
    ).length,
    completed: data.tickets.filter((t) => t.status === "completed").length,
    technicians: data.technicians.filter((t) => t.active).length,
    companies: data.companies.length,
  };
}
