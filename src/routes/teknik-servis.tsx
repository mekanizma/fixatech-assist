import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Building2,
  Phone,
  Mail,
  Package,
  Hash,
  MapPin,
  Calendar,
  Clock,
  Truck,
  AlertTriangle,
  Send,
  Wrench,
  ShieldCheck,
  ClipboardList,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PHONE, PHONE_TEL, waLink } from "@/lib/site";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/teknik-servis")({
  head: () => ({
    meta: [
      { title: "Teknik Servis Talebi — FİXATECH Endüstriyel Teknik Servis" },
      {
        name: "description",
        content:
          "Ürününüzü servise gönderin. Ürün bilgisi, adet, adres ve teslim alma randevusu ile hızlı teknik servis talebi oluşturun.",
      },
      { property: "og:title", content: "Teknik Servis Talebi — FİXATECH" },
      { property: "og:description", content: "Online teknik servis kayıt formu — hızlı randevu ve WhatsApp iletişim." },
      { property: "og:url", content: "/teknik-servis" },
    ],
    links: [{ rel: "canonical", href: "/teknik-servis" }],
  }),
  component: TechService,
});

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  productName: string;
  brand: string;
  model: string;
  quantity: string;
  category: string;
  serialNo: string;
  issue: string;
  address: string;
  district: string;
  city: string;
  delivery: string;
  pickupDate: string;
  pickupTime: string;
  urgency: string;
  notes: string;
};

const initialForm = (): FormState => ({
  name: "",
  company: "",
  phone: "",
  email: "",
  productName: "",
  brand: "",
  model: "",
  quantity: "1",
  category: "",
  serialNo: "",
  issue: "",
  address: "",
  district: "",
  city: "İstanbul",
  delivery: "pickup",
  pickupDate: "",
  pickupTime: "",
  urgency: "normal",
  notes: "",
});

function TechService() {
  const t = useT();
  const ts = t.techService;
  const [form, setForm] = useState<FormState>(initialForm);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const categories = ts.categories as string[];
  const timeSlots = ts.timeSlots as string[];
  const deliveryOptions = ts.deliveryOptions as { value: string; label: string; desc: string }[];
  const urgencyOptions = ts.urgencyOptions as { value: string; label: string; desc: string }[];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = ts.buildMsg(form);
    window.open(waLink(msg), "_blank");
    toast.success(ts.toastTitle, { description: ts.toastDesc });
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <HeroMesh />
        <HeroGlow />
        <HeroGlow className="right-0 left-auto translate-x-1/4 bg-accent/20" />
        <HeroGlow className="left-1/2 -translate-x-1/2 top-1/2 bg-primary/15 w-[420px] h-[420px]" />

        <div className="container mx-auto px-4 relative text-center max-w-3xl reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5" />
            {ts.label}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            {ts.title1}{" "}
            <span className="text-gradient-primary">{ts.titleHi}</span>
            {ts.title2 ? ` ${ts.title2}` : ""}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ts.sub}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-6 -mt-2">
        <div className="max-w-5xl mx-auto rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-lg">Kurumsal Teknik Servis Kontrol Paneli</p>
            <p className="text-sm text-muted-foreground mt-1">Kayıt, canlı takip ve PDF rapor — tek platformda.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app/giris" className="inline-flex px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-3d">
              Panele Giriş
            </Link>
            <Link to="/takip" className="inline-flex px-5 py-2.5 rounded-full border text-sm font-semibold hover:bg-muted">
              Servis Takip
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {(ts.steps as { title: string; desc: string }[]).map((step, i) => (
            <div
              key={step.title}
              className="relative bg-gradient-card rounded-2xl p-5 border border-border card-3d reveal text-center sm:text-left"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-glow">
                {i + 1}
              </div>
              <h3 className="font-semibold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              {i < 3 && (
                <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid xl:grid-cols-[1fr_340px] gap-8 items-start">
          <form onSubmit={submit} className="space-y-6 reveal">
            <FormSection icon={User} title={ts.sections.contact} subtitle={ts.sections.contactSub}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={User} label={ts.f.name} required>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    className="input"
                    placeholder={ts.f.namePh}
                  />
                </Field>
                <Field icon={Building2} label={ts.f.company}>
                  <input
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    className="input"
                    placeholder={ts.f.companyPh}
                  />
                </Field>
                <Field icon={Phone} label={ts.f.phone} required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    className="input"
                    placeholder={ts.f.phonePh}
                  />
                </Field>
                <Field icon={Mail} label={ts.f.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="input"
                    placeholder={ts.f.emailPh}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection icon={Package} title={ts.sections.product} subtitle={ts.sections.productSub}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={Package} label={ts.f.productName} required className="sm:col-span-2">
                  <input
                    value={form.productName}
                    onChange={(e) => set("productName", e.target.value)}
                    required
                    className="input"
                    placeholder={ts.f.productNamePh}
                  />
                </Field>
                <Field icon={Wrench} label={ts.f.category} required>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">{ts.f.categoryPh}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field icon={Hash} label={ts.f.quantity} required>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={form.quantity}
                    onChange={(e) => set("quantity", e.target.value)}
                    required
                    className="input"
                  />
                </Field>
                <Field icon={Package} label={ts.f.brand}>
                  <input
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    className="input"
                    placeholder={ts.f.brandPh}
                  />
                </Field>
                <Field icon={ClipboardList} label={ts.f.model}>
                  <input
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    className="input"
                    placeholder={ts.f.modelPh}
                  />
                </Field>
                <Field icon={Hash} label={ts.f.serialNo} className="sm:col-span-2">
                  <input
                    value={form.serialNo}
                    onChange={(e) => set("serialNo", e.target.value)}
                    className="input"
                    placeholder={ts.f.serialNoPh}
                  />
                </Field>
                <Field icon={MessageSquare} label={ts.f.issue} required className="sm:col-span-2">
                  <textarea
                    value={form.issue}
                    onChange={(e) => set("issue", e.target.value)}
                    required
                    rows={3}
                    className="input resize-none"
                    placeholder={ts.f.issuePh}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection icon={MapPin} title={ts.sections.address} subtitle={ts.sections.addressSub}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={MapPin} label={ts.f.address} required className="sm:col-span-2">
                  <textarea
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    required
                    rows={2}
                    className="input resize-none"
                    placeholder={ts.f.addressPh}
                  />
                </Field>
                <Field icon={MapPin} label={ts.f.district} required>
                  <input
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    required
                    className="input"
                    placeholder={ts.f.districtPh}
                  />
                </Field>
                <Field icon={MapPin} label={ts.f.city} required>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} required className="input" />
                </Field>
              </div>
            </FormSection>

            <FormSection icon={Truck} title={ts.sections.pickup} subtitle={ts.sections.pickupSub}>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-3">
                  {deliveryOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        form.delivery === opt.value
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.value}
                        checked={form.delivery === opt.value}
                        onChange={() => set("delivery", opt.value)}
                        className="sr-only"
                      />
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <span className="text-xs text-muted-foreground mt-1 leading-snug">{opt.desc}</span>
                    </label>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={Calendar} label={ts.f.pickupDate} required>
                    <input
                      type="date"
                      min={minDate}
                      value={form.pickupDate}
                      onChange={(e) => set("pickupDate", e.target.value)}
                      required
                      className="input"
                    />
                  </Field>
                  <Field icon={Clock} label={ts.f.pickupTime} required>
                    <select
                      value={form.pickupTime}
                      onChange={(e) => set("pickupTime", e.target.value)}
                      required
                      className="input"
                    >
                      <option value="">{ts.f.pickupTimePh}</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    {ts.f.urgency}
                  </span>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {urgencyOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          form.urgency === opt.value
                            ? opt.value === "emergency"
                              ? "border-destructive bg-destructive/5"
                              : "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={opt.value}
                          checked={form.urgency === opt.value}
                          onChange={() => set("urgency", opt.value)}
                          className="mt-1"
                        />
                        <div>
                          <span className="font-semibold text-sm flex items-center gap-1.5">
                            {opt.value === "emergency" && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                            {opt.label}
                          </span>
                          <span className="text-xs text-muted-foreground block mt-0.5">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Field icon={MessageSquare} label={ts.f.notes}>
                  <textarea
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    rows={2}
                    className="input resize-none"
                    placeholder={ts.f.notesPh}
                  />
                </Field>
              </div>
            </FormSection>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d text-base"
              >
                <Send className="w-4 h-4" />
                {ts.submit}
              </button>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-accent text-accent-foreground font-semibold btn-3d-accent"
              >
                <Phone className="w-4 h-4" />
                {t.common.callNow}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">{ts.disclaimer}</p>
          </form>

          <aside className="space-y-5 reveal xl:sticky xl:top-28">
            <div className="glass rounded-3xl p-6 border border-border/60 space-y-4">
              <h3 className="font-display font-bold text-lg">{ts.sidebar.title}</h3>
              <ul className="space-y-3">
                {(ts.sidebar.items as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-hero rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">{ts.sidebar.help}</p>
                <p className="font-display font-bold text-xl mb-3">{PHONE}</p>
                <p className="text-sm text-primary-foreground/80 mb-4">{ts.sidebar.helpSub}</p>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-glow hover:underline"
                >
                  {ts.sidebar.contactLink}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          border-radius: 0.875rem;
          background: var(--background);
          border: 1px solid var(--border);
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px oklch(0.7 0.18 230 / 0.15);
        }
      `}</style>
    </>
  );
}

function FormSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-card rounded-3xl p-6 md:p-8 border border-border shadow-sm">
      <div className="flex items-start gap-4 mb-6 pb-5 border-b border-border/60">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  required,
  className = "",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="relative">
        <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        {children}
      </div>
    </label>
  );
}

function HeroMesh() {
  return <div className="absolute inset-0 bg-gradient-mesh opacity-50" />;
}

function HeroGlow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none ${className}`}
    />
  );
}

