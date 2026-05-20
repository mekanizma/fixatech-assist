export type FormSubmissionType = "tech_service" | "contact";

export type FormSubmissionStatus = "new" | "read" | "converted" | "archived";

export type FormSubmission = {
  id: string;
  type: FormSubmissionType;
  status: FormSubmissionStatus;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyName: string;
  summary: string;
  payload: Record<string, unknown>;
  whatsappMessage: string;
  notes: string;
  readAt?: string;
  createdAt: string;
};

export type CreateFormSubmissionInput = {
  type: FormSubmissionType;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  companyName?: string;
  summary: string;
  payload: Record<string, unknown>;
  whatsappMessage: string;
};
