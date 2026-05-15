import { useMemo } from "react";
import { useDeskData } from "@/hooks/use-desk-data";
import type { ServiceTicket, TicketEvent, Technician } from "@/lib/service-desk/types";

export function useTicket(id: string | undefined) {
  const data = useDeskData();
  return useMemo(() => data.tickets.find((t) => t.id === id), [data.tickets, id]);
}

export function useTicketByCode(code: string | undefined) {
  const data = useDeskData();
  return useMemo(
    () => data.tickets.find((t) => t.code.toUpperCase() === (code ?? "").toUpperCase()),
    [data.tickets, code],
  );
}

export function useTicketEvents(ticketId: string | undefined): TicketEvent[] {
  const data = useDeskData();
  return useMemo(
    () =>
      data.events
        .filter((e) => e.ticketId === ticketId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [data.events, ticketId],
  );
}

export function useTechnician(id: string | undefined): Technician | undefined {
  const data = useDeskData();
  return useMemo(() => data.technicians.find((t) => t.id === id), [data.technicians, id]);
}

export function useTechnicianByUserId(userId: string | undefined) {
  const data = useDeskData();
  return useMemo(() => data.technicians.find((t) => t.userId === userId), [data.technicians, userId]);
}

export function useDashboardStats() {
  const data = useDeskData();
  return useMemo(() => {
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
  }, [data]);
}

export function useCustomerTickets(userId?: string, companyId?: string): ServiceTicket[] {
  const data = useDeskData();
  return useMemo(
    () =>
      data.tickets.filter((t) => t.companyId === companyId || t.createdByUserId === userId),
    [data.tickets, userId, companyId],
  );
}
