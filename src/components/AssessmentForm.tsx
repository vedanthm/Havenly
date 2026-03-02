"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import SectionCard from "./SectionCard";
import ChipSelect from "./ChipSelect";
import RoomAssessment, { getDefaultRooms, type RoomData } from "./RoomAssessment";
import EmailModal from "./EmailModal";
import PdfDocument from "./PdfDocument";
import { saveForm, loadForm, clearForm } from "@/lib/storage";

interface FormData {
  clientName: string;
  contactNumber: string;
  email: string;
  propertyLocation: string;
  propertyType: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  homeStatus: string;
  primaryObjective: string;
  timeline: string;
  selectedPackage: string;
  supportStaff: string;
  homeFeel: string[];
  frustrations: string;
  rooms: Record<string, RoomData>;
  buyerProfile: string[];
  sellingFeatures: string;
  distractingElements: string;
  estimatedScope: string;
  consultantNotes: string;
  clientSignName: string;
  clientSignDate: string;
  consultantSignName: string;
  consultantSignDate: string;
}

const defaultFormData: FormData = {
  clientName: "",
  contactNumber: "",
  email: "",
  propertyLocation: "",
  propertyType: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  homeStatus: "",
  primaryObjective: "",
  timeline: "",
  selectedPackage: "",
  supportStaff: "",
  homeFeel: [],
  frustrations: "",
  rooms: getDefaultRooms(),
  buyerProfile: [],
  sellingFeatures: "",
  distractingElements: "",
  estimatedScope: "",
  consultantNotes: "",
  clientSignName: "",
  clientSignDate: "",
  consultantSignName: "",
  consultantSignDate: "",
};

export default function AssessmentForm() {
  const [form, setForm] = useState<FormData>(defaultFormData);
  const [saved, setSaved] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadForm();
    if (saved) {
      setForm((prev) => ({ ...prev, ...saved } as FormData));
    }
  }, []);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveForm(form as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClear = () => {
    if (window.confirm("Clear all form data? This cannot be undone.")) {
      setForm(defaultFormData);
      clearForm();
    }
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const logoUrl = `${window.location.origin}/logo.png`;
      const blob = await pdf(<PdfDocument form={form} logoUrl={logoUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HAVENLY_Assessment_${form.clientName.replace(/\s+/g, "_") || "Client"}_${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendEmail = async (recipientEmail: string) => {
    setSending(true);
    try {
      const res = await fetch("/api/send-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: form, recipientEmail }),
      });
      if (!res.ok) throw new Error("Failed to send");
      alert("Assessment sent successfully!");
      setEmailOpen(false);
    } catch {
      alert("Failed to send email. Make sure the RESEND_API_KEY is configured.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-lg text-sm text-text-primary bg-cream/50 font-sans placeholder:text-text-muted";
  const labelClass =
    "block text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-2 font-sans";

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <img src="/logo.png" alt="Havenly" className="h-10 sm:h-12" />
          <button
            onClick={handleClear}
            className="text-xs tracking-wider uppercase text-text-muted hover:text-accent font-sans transition-colors"
          >
            Clear Form
          </button>
        </div>
      </header>

      {/* Auto-save toast */}
      {saved && (
        <div className="fixed top-20 right-6 z-50 toast-animate">
          <div className="bg-white border border-border rounded-lg shadow-md px-4 py-2 text-xs text-text-muted font-sans tracking-wide">
            Saved
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Havenly" className="h-20 sm:h-24 mx-auto mb-4" />
          <div className="w-16 h-px bg-accent mx-auto mt-2" />
          <p className="font-serif text-lg text-text-secondary mt-4 italic">
            Premium In-Person Assessment
          </p>
        </div>

        {/* Section 1: Client Profile */}
        <SectionCard number={1} title="Client Profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-2">
              <label className={labelClass}>Client Name</label>
              <input type="text" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} placeholder="Full name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <input type="tel" value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} placeholder="+971 XX XXX XXXX" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="client@email.com" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Property Location</label>
              <input type="text" value={form.propertyLocation} onChange={(e) => update("propertyLocation", e.target.value)} placeholder="Area, building, community" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Property Type</label>
              <ChipSelect options={["Apartment", "Villa", "Townhouse", "Other"]} value={form.propertyType} onChange={(v) => update("propertyType", v as string)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Property Size</label>
              <div className="grid grid-cols-3 gap-3">
                <select value={form.sqft} onChange={(e) => update("sqft", e.target.value)} className={inputClass}>
                  <option value="">sq ft</option>
                  <option value="Under 500">Under 500</option>
                  <option value="500–1,000">500–1,000</option>
                  <option value="1,000–1,500">1,000–1,500</option>
                  <option value="1,500–2,000">1,500–2,000</option>
                  <option value="2,000–3,000">2,000–3,000</option>
                  <option value="3,000–5,000">3,000–5,000</option>
                  <option value="5,000+">5,000+</option>
                </select>
                <select value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass}>
                  <option value="">Bedrooms</option>
                  <option value="Studio">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6+">6+</option>
                </select>
                <select value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass}>
                  <option value="">Bathrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6+">6+</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Home Status</label>
              <ChipSelect options={["Occupied", "Vacant", "Partially Furnished"]} value={form.homeStatus} onChange={(v) => update("homeStatus", v as string)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Primary Objective</label>
              <ChipSelect options={["Sale", "Lifestyle Upgrade", "Decluttering", "Luxury Styling", "Full Transformation"]} value={form.primaryObjective} onChange={(v) => update("primaryObjective", v as string)} />
            </div>
            <div>
              <label className={labelClass}>Timeline</label>
              <input type="text" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="Expected timeline" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Refresh", desc: "Light styling, decluttering & accessory placement" },
                  { name: "Elevate", desc: "Partial transformation with curated furniture & decor" },
                  { name: "Signature", desc: "Full HAVENLY transformation — styling, staging & redesign" },
                  { name: "Bespoke", desc: "Complete luxury overhaul tailored to your vision" },
                ].map((pkg) => {
                  const selected = form.selectedPackage === pkg.name;
                  return (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => update("selectedPackage", selected ? "" : pkg.name)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selected
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-white hover:border-accent/30"
                      }`}
                    >
                      <span className={`text-sm font-semibold font-sans block mb-1 ${selected ? "text-accent" : "text-text-primary"}`}>
                        {pkg.name}
                      </span>
                      <p className="text-xs text-text-muted font-sans leading-relaxed m-0">{pkg.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Support Staff</label>
              <ChipSelect options={["Havenly", "By Client"]} value={form.supportStaff} onChange={(v) => update("supportStaff", v as string)} />
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Vision & Lifestyle Alignment */}
        <SectionCard number={2} title="Vision & Lifestyle Alignment">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>How do you want your home to feel?</label>
              <ChipSelect options={["Calm & Minimal", "Warm & Inviting", "Luxury & Refined", "Functional & Efficient", "Family-Friendly", "Show-Home Ready"]} value={form.homeFeel} onChange={(v) => update("homeFeel", v as string[])} multi />
            </div>
            <div>
              <label className={labelClass}>Biggest Frustrations</label>
              <textarea value={form.frustrations} onChange={(e) => update("frustrations", e.target.value)} placeholder="What frustrates you most about your current space?" rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Room-by-Room Premium Assessment */}
        <SectionCard number={3} title="Room-by-Room Premium Assessment">
          <RoomAssessment rooms={form.rooms} onChange={(rooms) => update("rooms", rooms)} />
        </SectionCard>

        {/* Section 4: Staging-Specific Evaluation */}
        <SectionCard number={4} title="Staging-Specific Evaluation">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Target Buyer Profile</label>
              <ChipSelect options={["Young Professionals", "Families", "Luxury Buyers", "Investors"]} value={form.buyerProfile} onChange={(v) => update("buyerProfile", v as string[])} multi />
            </div>
            <div>
              <label className={labelClass}>Key Selling Features to Highlight</label>
              <textarea value={form.sellingFeatures} onChange={(e) => update("sellingFeatures", e.target.value)} placeholder="What are the strongest selling points of this property?" rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Distracting Elements to Remove</label>
              <textarea value={form.distractingElements} onChange={(e) => update("distractingElements", e.target.value)} placeholder="What should be removed or changed to improve appeal?" rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </SectionCard>

        {/* Section 5: Project Scope & Investment Evaluation */}
        <SectionCard number={5} title="Project Scope & Investment Evaluation">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Estimated Scope</label>
              <ChipSelect options={["Light Refresh", "Partial Transformation", "Full HAVENLY Signature Experience"]} value={form.estimatedScope} onChange={(v) => update("estimatedScope", v as string)} />
            </div>
            <div>
              <label className={labelClass}>Consultant Notes</label>
              <textarea value={form.consultantNotes} onChange={(e) => update("consultantNotes", e.target.value)} placeholder="Additional observations and recommendations..." rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Client Name</label>
                  <input type="text" value={form.clientSignName} onChange={(e) => update("clientSignName", e.target.value)} placeholder="Client full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" value={form.clientSignDate} onChange={(e) => update("clientSignDate", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Consultant Name</label>
                  <input type="text" value={form.consultantSignName} onChange={(e) => update("consultantSignName", e.target.value)} placeholder="Consultant full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" value={form.consultantSignDate} onChange={(e) => update("consultantSignDate", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-border py-4 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-accent text-white text-sm font-semibold font-sans tracking-wider uppercase hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {generating ? "Generating PDF..." : "Download PDF"}
          </button>
          <button
            onClick={() => setEmailOpen(true)}
            className="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-accent text-accent text-sm font-semibold font-sans tracking-wider uppercase hover:bg-accent hover:text-white transition-colors"
          >
            Send via Email
          </button>
        </div>
      </div>

      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} onSend={handleSendEmail} sending={sending} />
    </div>
  );
}
