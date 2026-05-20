import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFormSubmissions,
  updateFormSubmissionStatus,
} from "@/lib/form-submissions/api";
import { formSubmissionKeys } from "@/lib/form-submissions/query-keys";
import type { FormSubmissionStatus } from "@/lib/form-submissions/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function useFormSubmissions() {
  return useQuery({
    queryKey: formSubmissionKeys.all,
    queryFn: fetchFormSubmissions,
    enabled: isSupabaseConfigured(),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useUpdateFormSubmissionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: FormSubmissionStatus;
      notes?: string;
    }) => updateFormSubmissionStatus(id, status, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: formSubmissionKeys.all }),
  });
}
