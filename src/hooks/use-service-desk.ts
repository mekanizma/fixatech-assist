import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDeskData, useDeskQuery } from "@/hooks/use-desk-data";
import { fetchPublicTicketByCode, getTicket } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ServiceTicket, TicketEvent, Technician } from "@/lib/service-desk/types";

/** Cache + tekil fetch; yüklenirken notFound atılmasın diye isLoading döner. */
export function useTicket(id: string | undefined) {
  const desk = useDeskQuery();
  const fromDesk = useMemo(
    () => desk.data?.tickets.find((t) => t.id === id),
    [desk.data?.tickets, id],
  );

  const single = useQuery({
    queryKey: [...deskKeys.all, "ticket", id ?? ""] as const,
    queryFn: () => getTicket(id!),
    enabled: isSupabaseConfigured() && Boolean(id) && !fromDesk,
  });

  const ticket = fromDesk ?? single.data ?? undefined;
  const isLoading =
    Boolean(id) &&
    !ticket &&
    (desk.isPending || desk.isFetching || single.isPending || single.isFetching);

  return { ticket, isLoading };
}

export function useTicketByCode(code: string | undefined) {
  const desk = useDeskData();
  const fromDesk = useMemo(
    () => desk.tickets.find((t) => t.code.toUpperCase() === (code ?? "").toUpperCase()),
    [desk.tickets, code],
  );

  const { data: publicData } = useQuery({
    queryKey: deskKeys.publicTicket(code ?? ""),
    queryFn: () => fetchPublicTicketByCode(code!),
    enabled: isSupabaseConfigured() && Boolean(code) && !fromDesk,
  });

  return fromDesk ?? publicData?.ticket;
}

export function useTicketEvents(ticketId: string | undefined): TicketEvent[] {
  const data = useDeskData();
  const code = useMemo(() => data.tickets.find((t) => t.id === ticketId)?.code, [data.tickets, ticketId]);

  const { data: publicData } = useQuery({
    queryKey: deskKeys.publicTicket(code ?? ""),
    queryFn: () => fetchPublicTicketByCode(code!),
    enabled: isSupabaseConfigured() && Boolean(code) && !data.events.some((e) => e.ticketId === ticketId),
  });

  return useMemo(() => {
    const fromDesk = data.events
      .filter((e) => e.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (fromDesk.length) return fromDesk;
    if (publicData?.events?.length && publicData.ticket.id === ticketId) {
      return publicData.events;
    }
    return fromDesk;
  }, [data.events, ticketId, publicData]);
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
