import { getEphemeralSupabase, getSupabase } from "@/lib/supabase/client";
import { STATUS_LABELS } from "./constants";
import {
  mapCompany,
  mapEvent,
  mapProfile,
  mapTechnician,
  mapTicket,
  companyToRow,
  technicianToRow,
  ticketToInsert,
  type DbCompany,
  type DbEvent,
  type DbProfile,
  type DbTechnician,
  type DbTicket,
} from "./mappers";
import type {
  BusinessType,
  Company,
  ServiceDeskData,
  ServiceTicket,
  ServiceStatus,
  Technician,
  TicketEvent,
  TicketInput,
  User,
} from "./types";

export type CreateCustomerInput = {
  companyName: string;
  contactPerson: string;
  phone: string;
  companyEmail: string;
  loginEmail: string;
  password: string;
  address: string;
  district: string;
  city: string;
  type: BusinessType;
};

export type CreateCustomerResult = {
  company: Company;
  loginEmail: string;
  userId: string;
};

export type CreateTechnicianInput = {
  name: string;
  phone: string;
  loginEmail: string;
  password: string;
  specialties: string[];
  active?: boolean;
};

export type CreateTechnicianResult = {
  technician: Technician;
  loginEmail: string;
  userId: string;
};

const EMPTY: ServiceDeskData = {
  users: [],
  companies: [],
  technicians: [],
  tickets: [],
  events: [],
};

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchDeskData(): Promise<ServiceDeskData> {
  const sb = getSupabase();

  const [companiesRes, techniciansRes, ticketsRes, eventsRes] = await Promise.all([
    sb.from("companies").select("*").order("name"),
    sb.from("technicians").select("*").order("name"),
    sb.from("service_tickets").select("*").order("created_at", { ascending: false }),
    sb.from("ticket_events").select("*").order("created_at", { ascending: true }),
  ]);

  assertNoError(companiesRes.error);
  assertNoError(techniciansRes.error);
  assertNoError(ticketsRes.error);
  assertNoError(eventsRes.error);

  let users: User[] = [];
  const { data: profiles, error: profilesError } = await sb.from("profiles").select("*");
  if (!profilesError && profiles) {
    users = (profiles as DbProfile[]).map(mapProfile);
  }

  return {
    users,
    companies: ((companiesRes.data ?? []) as DbCompany[]).map(mapCompany),
    technicians: ((techniciansRes.data ?? []) as DbTechnician[]).map(mapTechnician),
    tickets: ((ticketsRes.data ?? []) as DbTicket[]).map(mapTicket),
    events: ((eventsRes.data ?? []) as DbEvent[]).map(mapEvent),
  };
}

export async function fetchProfile(userId: string): Promise<User | null> {
  const sb = getSupabase();
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  assertNoError(error);
  return data ? mapProfile(data as DbProfile) : null;
}

export type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

/** getSession çağırmaz — auth callback deadlock'unu önler. */
export async function ensureProfileForAuthUser(authUser: AuthUserLike): Promise<User | null> {
  const existing = await fetchProfile(authUser.id);
  if (existing) return existing;

  const sb = getSupabase();
  const { data: rpcRow, error: rpcError } = await sb.rpc("ensure_my_profile");
  if (!rpcError && rpcRow) {
    return mapProfile(rpcRow as DbProfile);
  }

  const meta = authUser.user_metadata ?? {};
  const roleRaw = meta.role;
  const role =
    roleRaw === "admin" || roleRaw === "technician" || roleRaw === "customer"
      ? roleRaw
      : "customer";

  const { data, error } = await sb
    .from("profiles")
    .upsert({
      id: authUser.id,
      email: authUser.email ?? "",
      name: String(meta.name ?? authUser.email?.split("@")[0] ?? "Kullanıcı"),
      role,
      phone: meta.phone ? String(meta.phone) : null,
      company_id: meta.company_id ? String(meta.company_id) : null,
    })
    .select()
    .single();

  if (error) {
    console.error("ensureProfileForAuthUser:", error.message, rpcError?.message);
    return null;
  }
  return mapProfile(data as DbProfile);
}

/** @deprecated ensureProfileForAuthUser kullanın */
export async function ensureProfile(): Promise<User | null> {
  const sb = getSupabase();
  const { data } = await sb.auth.getSession();
  const u = data.session?.user;
  if (!u) return null;
  return ensureProfileForAuthUser({
    id: u.id,
    email: u.email,
    user_metadata: u.user_metadata as Record<string, unknown>,
  });
}

export async function fetchPublicTicketByCode(
  code: string,
): Promise<{ ticket: ServiceTicket; events: TicketEvent[] } | null> {
  const sb = getSupabase();
  const { data, error } = await sb.rpc("get_public_ticket", { p_code: code });
  assertNoError(error);
  if (!data?.ticket) return null;
  return {
    ticket: mapTicket(data.ticket as DbTicket),
    events: ((data.events ?? []) as DbEvent[]).map(mapEvent),
  };
}

export async function getCompany(id: string): Promise<Company | undefined> {
  const sb = getSupabase();
  const { data, error } = await sb.from("companies").select("*").eq("id", id).maybeSingle();
  assertNoError(error);
  return data ? mapCompany(data as DbCompany) : undefined;
}

export async function getTechnician(id: string): Promise<Technician | undefined> {
  const sb = getSupabase();
  const { data, error } = await sb.from("technicians").select("*").eq("id", id).maybeSingle();
  assertNoError(error);
  return data ? mapTechnician(data as DbTechnician) : undefined;
}

export async function getTicketEvents(ticketId: string): Promise<TicketEvent[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("ticket_events")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  assertNoError(error);
  return ((data ?? []) as DbEvent[]).map(mapEvent);
}

async function insertEvent(
  ticketId: string,
  partial: Omit<TicketEvent, "id" | "ticketId" | "createdAt">,
) {
  const sb = getSupabase();
  const { error } = await sb.from("ticket_events").insert({
    ticket_id: ticketId,
    type: partial.type,
    message: partial.message,
    created_by: partial.createdBy,
    created_by_name: partial.createdByName,
    meta: partial.meta ?? null,
  });
  assertNoError(error);
}

export async function upsertCompany(company: Company) {
  const sb = getSupabase();
  const { error } = await sb.from("companies").upsert(companyToRow(company));
  assertNoError(error);
}

export async function linkProfileToCompany(userId: string, companyId: string) {
  const sb = getSupabase();
  const { error } = await sb.from("profiles").update({ company_id: companyId }).eq("id", userId);
  assertNoError(error);
}

/** Admin: firma + müşteri portal hesabı (giriş e-posta/şifre). Admin oturumu korunur. */
export async function createCustomerAccount(
  input: CreateCustomerInput,
): Promise<CreateCustomerResult> {
  const companyId = crypto.randomUUID();
  const company: Company = {
    id: companyId,
    name: input.companyName.trim(),
    contactPerson: input.contactPerson.trim(),
    phone: input.phone.trim(),
    email: input.companyEmail.trim() || input.loginEmail.trim(),
    address: input.address.trim(),
    district: input.district.trim(),
    city: input.city.trim(),
    type: input.type,
  };

  await upsertCompany(company);

  const loginEmail = input.loginEmail.trim().toLowerCase();
  const ephemeral = getEphemeralSupabase();
  const { data, error } = await ephemeral.auth.signUp({
    email: loginEmail,
    password: input.password,
    options: {
      data: {
        role: "customer",
        name: input.contactPerson.trim(),
        company_id: companyId,
        phone: input.phone.trim(),
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("Kullanıcı oluşturulamadı. Supabase → Authentication → Email ayarlarını kontrol edin.");
  }

  const sb = getSupabase();
  const { error: profileError } = await sb.from("profiles").upsert({
    id: data.user.id,
    email: loginEmail,
    name: input.contactPerson.trim(),
    role: "customer",
    phone: input.phone.trim(),
    company_id: companyId,
  });
  assertNoError(profileError);

  return { company, loginEmail, userId: data.user.id };
}

/** Admin: teknisyen profili + saha paneli giriş hesabı. Admin oturumu korunur. */
export async function createTechnicianAccount(
  input: CreateTechnicianInput,
): Promise<CreateTechnicianResult> {
  const loginEmail = input.loginEmail.trim().toLowerCase();
  const ephemeral = getEphemeralSupabase();
  const { data, error } = await ephemeral.auth.signUp({
    email: loginEmail,
    password: input.password,
    options: {
      data: {
        role: "technician",
        name: input.name.trim(),
        phone: input.phone.trim(),
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("Kullanıcı oluşturulamadı. Supabase → Authentication → Email ayarlarını kontrol edin.");
  }

  const sb = getSupabase();
  const { error: profileError } = await sb.from("profiles").upsert({
    id: data.user.id,
    email: loginEmail,
    name: input.name.trim(),
    role: "technician",
    phone: input.phone.trim(),
    company_id: null,
  });
  assertNoError(profileError);

  const technician: Technician = {
    id: crypto.randomUUID(),
    userId: data.user.id,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: loginEmail,
    specialties: input.specialties,
    active: input.active ?? true,
  };
  await upsertTechnician(technician);

  return { technician, loginEmail, userId: data.user.id };
}

export async function upsertTechnician(tech: Technician) {
  const sb = getSupabase();
  const row = technicianToRow(tech);
  const { error } = await sb.from("technicians").upsert(row);
  assertNoError(error);
}

export async function createTicket(
  input: TicketInput,
  actor: { id: string; name: string },
): Promise<ServiceTicket> {
  const sb = getSupabase();
  const { data: code, error: codeError } = await sb.rpc("next_ticket_code");
  assertNoError(codeError);
  if (!code) throw new Error("Talep kodu üretilemedi");

  const now = new Date().toISOString();
  const draft: ServiceTicket = {
    ...input,
    id: "",
    code: code as string,
    status: "pending",
    createdByUserId: input.createdByUserId ?? actor.id,
    createdAt: now,
    updatedAt: now,
  };

  const { data, error } = await sb
    .from("service_tickets")
    .insert(ticketToInsert(draft))
    .select("*")
    .single();
  assertNoError(error);

  const ticket = mapTicket(data as DbTicket);
  await insertEvent(ticket.id, {
    type: "status",
    message: "Servis kaydı oluşturuldu — Beklemede",
    createdBy: actor.id,
    createdByName: actor.name,
  });
  return ticket;
}

export async function updateTicketStatus(
  ticketId: string,
  status: ServiceStatus,
  actor: { id: string; name: string },
) {
  const sb = getSupabase();
  const { error } = await sb
    .from("service_tickets")
    .update({ status })
    .eq("id", ticketId);
  assertNoError(error);
  await insertEvent(ticketId, {
    type: "status",
    message: `Durum güncellendi: ${STATUS_LABELS[status]}`,
    createdBy: actor.id,
    createdByName: actor.name,
    meta: { status },
  });
}

export async function assignTechnician(
  ticketId: string,
  technicianId: string,
  actor: { id: string; name: string },
) {
  const sb = getSupabase();
  const tech = await getTechnician(technicianId);
  if (!tech) return;

  const { data: existing } = await sb
    .from("service_tickets")
    .select("status")
    .eq("id", ticketId)
    .single();

  const status =
    existing?.status === "pending" ? "assigned" : (existing?.status as ServiceStatus);

  const { error } = await sb
    .from("service_tickets")
    .update({ assigned_technician_id: technicianId, status })
    .eq("id", ticketId);
  assertNoError(error);

  await insertEvent(ticketId, {
    type: "assignment",
    message: `${tech.name} atandı`,
    createdBy: actor.id,
    createdByName: actor.name,
    meta: { technicianId },
  });
}

export async function addTicketNote(
  ticketId: string,
  message: string,
  actor: { id: string; name: string },
) {
  await insertEvent(ticketId, {
    type: "note",
    message,
    createdBy: actor.id,
    createdByName: actor.name,
  });
}

export async function updateTicket(
  ticketId: string,
  patch: Partial<ServiceTicket>,
  actor?: { id: string; name: string },
) {
  const sb = getSupabase();
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.workPerformed !== undefined) row.work_performed = patch.workPerformed;
  if (patch.partsUsed !== undefined) row.parts_used = patch.partsUsed;
  if (patch.invoiceAmount !== undefined) row.invoice_amount = patch.invoiceAmount;
  if (patch.technicianSignature !== undefined) row.technician_signature = patch.technicianSignature;
  if (patch.customerSignature !== undefined) row.customer_signature = patch.customerSignature;
  if (patch.photos !== undefined) row.photos = patch.photos;
  if (patch.assignedTechnicianId !== undefined) {
    row.assigned_technician_id = patch.assignedTechnicianId;
  }

  if (Object.keys(row).length) {
    const { error } = await sb.from("service_tickets").update(row).eq("id", ticketId);
    assertNoError(error);
  }

  if (patch.workPerformed && actor) {
    await insertEvent(ticketId, {
      type: "work",
      message: patch.workPerformed,
      createdBy: actor.id,
      createdByName: actor.name,
    });
  }
}

export async function completeTicket(
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
  const sb = getSupabase();
  const { error } = await sb
    .from("service_tickets")
    .update({
      status: "completed",
      work_performed: payload.workPerformed,
      parts_used: payload.partsUsed ?? null,
      technician_signature: payload.technicianSignature ?? null,
      customer_signature: payload.customerSignature ?? null,
      invoice_amount: payload.invoiceAmount ?? null,
    })
    .eq("id", ticketId);
  assertNoError(error);

  await insertEvent(ticketId, {
    type: "status",
    message: "Servis tamamlandı",
    createdBy: actor.id,
    createdByName: actor.name,
  });
  await insertEvent(ticketId, {
    type: "work",
    message: payload.workPerformed,
    createdBy: actor.id,
    createdByName: actor.name,
  });
}

export async function addTicketPhoto(
  ticketId: string,
  dataUrl: string,
  actor: { id: string; name: string },
) {
  const sb = getSupabase();
  const { data: ticket, error: fetchError } = await sb
    .from("service_tickets")
    .select("photos")
    .eq("id", ticketId)
    .single();
  assertNoError(fetchError);

  const photos = [...((ticket?.photos as string[]) ?? []), dataUrl];
  const { error } = await sb.from("service_tickets").update({ photos }).eq("id", ticketId);
  assertNoError(error);

  await insertEvent(ticketId, {
    type: "photo",
    message: "Fotoğraf eklendi",
    createdBy: actor.id,
    createdByName: actor.name,
  });
}

export function getDashboardStats(data: ServiceDeskData) {
  const today = new Date().toISOString().split("T")[0];
  return {
    total: data.tickets.length,
    today: data.tickets.filter((t) => t.serviceDate === today).length,
    pending: data.tickets.filter((t) => t.status === "pending").length,
    critical: data.tickets.filter((t) => t.urgency === "critical" && t.status !== "completed")
      .length,
    inProgress: data.tickets.filter((t) =>
      ["assigned", "en_route", "in_progress", "waiting_parts"].includes(t.status),
    ).length,
    completed: data.tickets.filter((t) => t.status === "completed").length,
    technicians: data.technicians.filter((t) => t.active).length,
    companies: data.companies.length,
  };
}

export { EMPTY as emptyDeskData };
