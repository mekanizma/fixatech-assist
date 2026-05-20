import type {
  Company,
  ServiceTicket,
  Technician,
  TicketEvent,
  User,
  PartUsed,
  WorkLineItem,
} from "./types";

export type DbCompany = {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  type: Company["type"];
};

export type DbProfile = {
  id: string;
  email: string;
  name: string;
  role: User["role"];
  phone: string | null;
  company_id: string | null;
  avatar: string | null;
};

export type DbTechnician = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  specialties: string[];
  active: boolean;
  location: { lat: number; lng: number; label: string } | null;
};

export type DbTicket = {
  id: string;
  code: string;
  company_id: string;
  created_by_user_id: string;
  assigned_technician_id: string | null;
  status: ServiceTicket["status"];
  urgency: ServiceTicket["urgency"];
  service_mode: ServiceTicket["serviceMode"];
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  business_type: ServiceTicket["businessType"];
  product_type: string;
  product_name: string;
  brand: string;
  model: string;
  serial_no: string;
  quantity: number;
  issue_description: string;
  photos: string[];
  videos: string[];
  service_date: string;
  service_time: string;
  estimated_completion: string | null;
  warranty_status: ServiceTicket["warrantyStatus"];
  previous_service: boolean;
  notes: string;
  work_performed: string | null;
  work_items: WorkLineItem[] | null;
  parts_used: PartUsed[] | null;
  invoice_amount: number | null;
  technician_signature: string | null;
  customer_signature: string | null;
  location: { lat: number; lng: number } | null;
  created_at: string;
  updated_at: string;
};

export type DbEvent = {
  id: string;
  ticket_id: string;
  type: TicketEvent["type"];
  message: string;
  created_by: string;
  created_by_name: string;
  meta: Record<string, string> | null;
  created_at: string;
};

export function mapProfile(row: DbProfile): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    phone: row.phone ?? undefined,
    companyId: row.company_id ?? undefined,
    avatar: row.avatar ?? undefined,
  };
}

export function mapCompany(row: DbCompany): Company {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    address: row.address,
    district: row.district,
    city: row.city,
    type: row.type,
  };
}

export function mapTechnician(row: DbTechnician): Technician {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    specialties: row.specialties ?? [],
    active: row.active,
    location: row.location ?? undefined,
  };
}

export function mapTicket(row: DbTicket): ServiceTicket {
  return {
    id: row.id,
    code: row.code,
    companyId: row.company_id,
    createdByUserId: row.created_by_user_id,
    assignedTechnicianId: row.assigned_technician_id ?? undefined,
    status: row.status,
    urgency: row.urgency,
    serviceMode: row.service_mode,
    companyName: row.company_name,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    address: row.address,
    district: row.district,
    city: row.city,
    businessType: row.business_type,
    productType: row.product_type,
    productName: row.product_name,
    brand: row.brand,
    model: row.model,
    serialNo: row.serial_no,
    quantity: row.quantity,
    issueDescription: row.issue_description,
    photos: row.photos ?? [],
    videos: row.videos ?? [],
    serviceDate: row.service_date,
    serviceTime: row.service_time,
    estimatedCompletion: row.estimated_completion ?? undefined,
    warrantyStatus: row.warranty_status,
    previousService: row.previous_service,
    notes: row.notes,
    workPerformed: row.work_performed ?? undefined,
    workItems: (row.work_items ?? []).length ? (row.work_items ?? []) : undefined,
    partsUsed: row.parts_used ?? undefined,
    invoiceAmount: row.invoice_amount != null ? Number(row.invoice_amount) : undefined,
    technicianSignature: row.technician_signature ?? undefined,
    customerSignature: row.customer_signature ?? undefined,
    location: row.location ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapEvent(row: DbEvent): TicketEvent {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    type: row.type,
    message: row.message,
    createdAt: row.created_at,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    meta: row.meta ?? undefined,
  };
}

export function ticketToInsert(
  input: Omit<ServiceTicket, "id" | "code" | "createdAt" | "updatedAt"> & { code: string },
) {
  return {
    code: input.code,
    company_id: input.companyId,
    created_by_user_id: input.createdByUserId,
    assigned_technician_id: input.assignedTechnicianId ?? null,
    status: input.status,
    urgency: input.urgency,
    service_mode: input.serviceMode,
    company_name: input.companyName,
    contact_person: input.contactPerson,
    phone: input.phone,
    email: input.email,
    address: input.address,
    district: input.district,
    city: input.city,
    business_type: input.businessType,
    product_type: input.productType,
    product_name: input.productName,
    brand: input.brand,
    model: input.model,
    serial_no: input.serialNo,
    quantity: input.quantity,
    issue_description: input.issueDescription,
    photos: input.photos,
    videos: input.videos,
    service_date: input.serviceDate,
    service_time: input.serviceTime,
    estimated_completion: input.estimatedCompletion ?? null,
    warranty_status: input.warrantyStatus,
    previous_service: input.previousService,
    notes: input.notes,
    work_performed: input.workPerformed ?? null,
    work_items: input.workItems ?? [],
    parts_used: input.partsUsed ?? null,
    invoice_amount: input.invoiceAmount ?? null,
    technician_signature: input.technicianSignature ?? null,
    customer_signature: input.customerSignature ?? null,
    location: input.location ?? null,
  };
}

export function companyToRow(company: Company): DbCompany {
  return {
    id: company.id,
    name: company.name,
    contact_person: company.contactPerson,
    phone: company.phone,
    email: company.email,
    address: company.address,
    district: company.district,
    city: company.city,
    type: company.type,
  };
}

export function technicianToRow(tech: Technician) {
  return {
    id: tech.id,
    user_id: tech.userId,
    name: tech.name,
    phone: tech.phone,
    email: tech.email,
    specialties: tech.specialties,
    active: tech.active,
    location: tech.location ?? null,
  };
}
