import { useQuery } from "@tanstack/react-query";
import { emptyDeskData, fetchDeskData } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ServiceDeskData } from "@/lib/service-desk/types";

export function useDeskData(): ServiceDeskData {
  const { data } = useQuery({
    queryKey: deskKeys.all,
    queryFn: fetchDeskData,
    enabled: isSupabaseConfigured(),
    staleTime: 15_000,
    retry: 1,
  });
  return data ?? emptyDeskData;
}

export function useDeskQuery() {
  return useQuery({
    queryKey: deskKeys.all,
    queryFn: fetchDeskData,
    enabled: isSupabaseConfigured(),
    staleTime: 15_000,
    retry: 1,
  });
}
