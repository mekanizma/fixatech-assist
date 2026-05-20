export type UserRole = "admin" | "technician" | "customer";

export type ServiceStatus =
  | "pending"
  | "assigned"
  | "en_route"
  | "in_progress"
  | "waiting_parts"
  | "completed";

export type Urgency = "normal" | "urgent" | "critical";
export type ServiceMode = "onsite" | "workshop";
export type WarrantyStatus = "yes" | "no" | "unknown";
export type BusinessType = "hotel" | "restaurant" | "cafe" | "industrial_kitchen" | "corporate";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  companyId?: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  type: BusinessType;
}

export interface Technician {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  specialties: string[];
  active: boolean;
  location?: { lat: number; lng: number; label: string };
}

export interface PartUsed {
  name: string;
  qty: number;
  cost?: number;
}

/** İşçilik / yapılan işlem fiyat kalemi */
export interface WorkLineItem {
  description: string;
  amount: number;
}

export interface TicketEvent {
  id: string;
  ticketId: string;
  type: "status" | "note" | "assignment" | "photo" | "work" | "part" | "invoice";
  message: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  meta?: Record<string, string>;
}

export interface ServiceTicket {
  id: string;
  code: string;
  companyId: string;
  createdByUserId: string;
  assignedTechnicianId?: string;
  status: ServiceStatus;
  urgency: Urgency;
  serviceMode: ServiceMode;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  businessType: BusinessType;
  productType: string;
  productName: string;
  brand: string;
  model: string;
  serialNo: string;
  quantity: number;
  issueDescription: string;
  photos: string[];
  videos: string[];
  serviceDate: string;
  serviceTime: string;
  estimatedCompletion?: string;
  warrantyStatus: WarrantyStatus;
  previousService: boolean;
  notes: string;
  workPerformed?: string;
  workItems?: WorkLineItem[];
  partsUsed?: PartUsed[];
  invoiceAmount?: number;
  technicianSignature?: string;
  customerSignature?: string;
  location?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDeskData {
  users: User[];
  companies: Company[];
  technicians: Technician[];
  tickets: ServiceTicket[];
  events: TicketEvent[];
}

export type TicketInput = Omit<
  ServiceTicket,
  "id" | "code" | "createdAt" | "updatedAt" | "status" | "createdByUserId"
> & {
  createdByUserId?: string;
};

export interface Session {
  userId: string;
  role: UserRole;
  expiresAt: number;
}
