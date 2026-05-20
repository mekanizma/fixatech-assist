import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { CreateFormSubmissionInput, FormSubmission, FormSubmissionStatus } from "./types";

type DbRow = {
  id: string;
  type: FormSubmission["type"];
  status: FormSubmissionStatus;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  company_name: string;
  summary: string;
  payload: Record<string, unknown>;
  whatsapp_message: string;
  notes: string;
  read_at: string | null;
  created_at: string;
};

function mapRow(row: DbRow): FormSubmission {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email,
    companyName: row.company_name,
    summary: row.summary,
    payload: row.payload ?? {},
    whatsappMessage: row.whatsapp_message,
    notes: row.notes,
    readAt: row.read_at ?? undefined,
    createdAt: row.created_at,
  };
}

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createFormSubmission(input: CreateFormSubmissionInput): Promise<FormSubmission | null> {
  if (!isSupabaseConfigured()) return null;

  const sb = getSupabase();
  const { data, error } = await sb
    .from("form_submissions")
    .insert({
      type: input.type,
      contact_name: input.contactName ?? "",
      contact_phone: input.contactPhone ?? "",
      contact_email: input.contactEmail ?? "",
      company_name: input.companyName ?? "",
      summary: input.summary,
      payload: input.payload,
      whatsapp_message: input.whatsappMessage,
    })
    .select("*")
    .single();

  assertNoError(error);
  return data ? mapRow(data as DbRow) : null;
}

export async function fetchFormSubmissionById(id: string): Promise<FormSubmission | null> {
  const sb = getSupabase();
  const { data, error } = await sb.from("form_submissions").select("*").eq("id", id).maybeSingle();
  assertNoError(error);
  return data ? mapRow(data as DbRow) : null;
}

export async function fetchFormSubmissions(): Promise<FormSubmission[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map((row) => mapRow(row as DbRow));
}

export async function updateFormSubmissionStatus(
  id: string,
  status: FormSubmissionStatus,
  notes?: string,
): Promise<void> {
  const sb = getSupabase();
  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.notes = notes;
  if (status === "read") patch.read_at = new Date().toISOString();

  const { error } = await sb.from("form_submissions").update(patch).eq("id", id);
  assertNoError(error);
}
