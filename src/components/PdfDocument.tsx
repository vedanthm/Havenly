import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { RoomData } from "./RoomAssessment";

const ROOMS = [
  "Entry", "Living Room", "Dining", "Kitchen", "Bedrooms",
  "Bathrooms", "Wardrobes", "Home Office", "Kids Room",
  "Storage Areas", "Balcony / Outdoor",
];
const CATEGORIES = ["Condition", "Clutter", "Storage", "Visual Appeal", "Lighting"];

const c = {
  accent: "#8B7355",
  accentLight: "#A89478",
  text: "#3D3225",
  textMid: "#6B5D4F",
  textMuted: "#9B8E80",
  border: "#E8DFD4",
  cream: "#FAF8F5",
  chipBg: "#F0EBE4",
  white: "#FFFFFF",
};

const s = StyleSheet.create({
  page: { paddingTop: 60, paddingBottom: 50, paddingHorizontal: 36, backgroundColor: c.white, fontSize: 10, color: c.text },
  pageHeader: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 36, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.border },
  pageHeaderTitle: { fontSize: 12, fontWeight: "light", letterSpacing: 4, color: c.text },
  pageHeaderTagline: { fontSize: 6, letterSpacing: 2, color: c.textMuted, textTransform: "uppercase" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 36, paddingVertical: 12, borderTopWidth: 1, borderTopColor: c.border },
  footerText: { fontSize: 7, color: c.textMuted, letterSpacing: 1 },

  // Hero Header (page 1 only)
  headerWrap: { alignItems: "center", marginBottom: 28 },
  title: { fontSize: 28, fontWeight: "light", letterSpacing: 6, color: c.text },
  tagline: { fontSize: 8, letterSpacing: 4, color: c.textMuted, textTransform: "uppercase", marginTop: 2 },
  divider: { width: 40, height: 1, backgroundColor: c.accent, marginVertical: 10 },
  subtitle: { fontSize: 12, color: c.textMid, fontStyle: "italic" },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: c.border },
  sectionBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: c.accent, color: c.white, fontSize: 10, fontWeight: "bold", textAlign: "center", lineHeight: 1, paddingTop: 7 },
  sectionTitle: { fontSize: 14, fontWeight: "light", letterSpacing: 3, textTransform: "uppercase", color: c.text },

  // Fields
  fieldRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  fieldHalf: { flex: 1 },
  fieldFull: { marginBottom: 10 },
  label: { fontSize: 7, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", color: c.accent, marginBottom: 4 },
  value: { fontSize: 10, color: c.text, paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border, minHeight: 20 },
  valueEmpty: { fontSize: 10, color: c.textMuted, fontStyle: "italic", paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  textBlock: { fontSize: 10, color: c.text, paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border, minHeight: 30 },

  // Chips
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chipActive: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, backgroundColor: c.accent, color: c.white, fontSize: 8, fontWeight: "medium" },
  chipInactive: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, backgroundColor: c.chipBg, color: c.textMuted, fontSize: 8 },

  // Room table
  table: { marginTop: 6 },
  tableNote: { fontSize: 7, color: c.textMuted, marginBottom: 6, letterSpacing: 0.5 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: c.cream, borderBottomWidth: 2, borderBottomColor: c.accent },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.border },
  tableRowAlt: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.border, backgroundColor: c.cream },
  thSpace: { width: 80, padding: 5, fontSize: 7, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", color: c.accent },
  thCat: { width: 52, padding: 5, fontSize: 6, fontWeight: "bold", letterSpacing: 0.5, textTransform: "uppercase", color: c.accent, textAlign: "center" },
  thAction: { flex: 1, padding: 5, fontSize: 7, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", color: c.accent },
  tdSpace: { width: 80, padding: 5, fontSize: 9, fontWeight: "medium", color: c.text },
  tdCat: { width: 52, padding: 5, fontSize: 9, textAlign: "center", color: c.textMid },
  tdCatEmpty: { width: 52, padding: 5, fontSize: 9, textAlign: "center", color: "#C4B8A8" },
  tdAction: { flex: 1, padding: 5, fontSize: 8, color: c.textMid },

  // Signatures
  sigRow: { flexDirection: "row", gap: 20, marginTop: 10, paddingTop: 14, borderTopWidth: 1, borderTopColor: c.border },
  sigBlock: { flex: 1 },
});

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

// --- Helpers ---

const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={s.fieldFull}>
    <Text style={s.label}>{label}</Text>
    <Text style={value ? s.value : s.valueEmpty}>{value || "—"}</Text>
  </View>
);

const FieldHalf = ({ label, value }: { label: string; value: string }) => (
  <View style={s.fieldHalf}>
    <Text style={s.label}>{label}</Text>
    <Text style={value ? s.value : s.valueEmpty}>{value || "—"}</Text>
  </View>
);

const TextBlock = ({ label, value }: { label: string; value: string }) => (
  <View style={s.fieldFull}>
    <Text style={s.label}>{label}</Text>
    <Text style={value ? s.textBlock : s.valueEmpty}>{value || "—"}</Text>
  </View>
);

const Chips = ({ label, options, selected }: { label: string; options: string[]; selected: string[] }) => (
  <View style={s.fieldFull}>
    <Text style={s.label}>{label}</Text>
    <View style={s.chipRow}>
      {options.map((opt) => (
        <Text key={opt} style={selected.includes(opt) ? s.chipActive : s.chipInactive}>
          {opt}
        </Text>
      ))}
    </View>
  </View>
);

const SectionHead = ({ num, title }: { num: number; title: string }) => (
  <View style={s.sectionHeader}>
    <Text style={s.sectionBadge}>{num}</Text>
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
);

const PageHeader = ({ logoUrl }: { logoUrl: string }) => (
  <View style={s.pageHeader} fixed>
    <Image src={logoUrl} style={{ height: 24, width: 85 }} />
    <Text style={s.pageHeaderTagline}>Premium In-Person Assessment</Text>
  </View>
);

const PageFooter = ({ page, total }: { page: number; total: number }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerText}>HAVENLY Premium Assessment</Text>
    <Text style={s.footerText}>Page {page} of {total}</Text>
  </View>
);

// --- Main Document ---

export default function PdfDocument({ form, logoUrl }: { form: FormData; logoUrl: string }) {
  const selectedFeel = form.homeFeel || [];
  const selectedBuyer = form.buyerProfile || [];

  return (
    <Document>
      {/* Page 1: Header + Client Profile + Vision */}
      <Page size="A4" style={s.page}>
        <PageHeader logoUrl={logoUrl} />
        <View style={s.headerWrap}>
          <Image src={logoUrl} style={{ height: 60, width: 210, marginBottom: 8 }} />
          <View style={s.divider} />
          <Text style={s.subtitle}>Premium In-Person Assessment</Text>
        </View>

        <View style={s.section}>
          <SectionHead num={1} title="Client Profile" />
          <Field label="Client Name" value={form.clientName} />
          <View style={s.fieldRow}>
            <FieldHalf label="Contact Number" value={form.contactNumber} />
            <FieldHalf label="Email" value={form.email} />
          </View>
          <Field label="Property Location" value={form.propertyLocation} />
          <Chips label="Property Type" options={["Apartment", "Villa", "Townhouse", "Other"]} selected={form.propertyType ? [form.propertyType] : []} />
          <Field label="Property Size" value={`${form.sqft || "—"} sq ft  |  ${form.bedrooms || "—"} Bedrooms  |  ${form.bathrooms || "—"} Bathrooms`} />
          <Chips label="Home Status" options={["Occupied", "Vacant", "Partially Furnished"]} selected={form.homeStatus ? [form.homeStatus] : []} />
          <Chips label="Primary Objective" options={["Sale", "Lifestyle Upgrade", "Decluttering", "Luxury Styling", "Full Transformation"]} selected={form.primaryObjective ? [form.primaryObjective] : []} />
          <Field label="Timeline" value={form.timeline} />
          <Chips label="Package" options={["Refresh", "Elevate", "Signature", "Bespoke"]} selected={form.selectedPackage ? [form.selectedPackage] : []} />
          <Chips label="Support Staff" options={["Havenly", "By Client"]} selected={form.supportStaff ? [form.supportStaff] : []} />
        </View>

        <View style={s.section}>
          <SectionHead num={2} title="Vision & Lifestyle Alignment" />
          <Chips label="How do you want your home to feel?" options={["Calm & Minimal", "Warm & Inviting", "Luxury & Refined", "Functional & Efficient", "Family-Friendly", "Show-Home Ready"]} selected={selectedFeel} />
          <TextBlock label="Biggest Frustrations" value={form.frustrations} />
        </View>

        <PageFooter page={1} total={3} />
      </Page>

      {/* Page 2: Room-by-Room Assessment */}
      <Page size="A4" style={s.page}>
        <PageHeader logoUrl={logoUrl} />
        <View style={s.section}>
          <SectionHead num={3} title="Room-by-Room Premium Assessment" />
          <Text style={s.tableNote}>
            Rating Scale: 1 (Complete Transformation) — 5 (Showcase Ready)
          </Text>
          <View style={s.table}>
            <View style={s.tableHeaderRow}>
              <Text style={s.thSpace}>Space</Text>
              {CATEGORIES.map((cat) => (
                <Text key={cat} style={s.thCat}>{cat}</Text>
              ))}
              <Text style={s.thAction}>Recommended Action</Text>
            </View>
            {ROOMS.map((room, i) => {
              const data = form.rooms[room];
              return (
                <View key={room} style={i % 2 === 0 ? s.tableRowAlt : s.tableRow}>
                  <Text style={s.tdSpace}>{room}</Text>
                  {CATEGORIES.map((cat) => {
                    const val = data?.ratings[cat] || 0;
                    return (
                      <Text key={cat} style={val > 0 ? s.tdCat : s.tdCatEmpty}>
                        {val > 0 ? String(val) : "—"}
                      </Text>
                    );
                  })}
                  <Text style={s.tdAction}>{data?.action || "—"}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <PageFooter page={2} total={3} />
      </Page>

      {/* Page 3: Staging + Scope + Signatures */}
      <Page size="A4" style={s.page}>
        <PageHeader logoUrl={logoUrl} />
        <View style={s.section}>
          <SectionHead num={4} title="Staging-Specific Evaluation" />
          <Chips label="Target Buyer Profile" options={["Young Professionals", "Families", "Luxury Buyers", "Investors"]} selected={selectedBuyer} />
          <TextBlock label="Key Selling Features to Highlight" value={form.sellingFeatures} />
          <TextBlock label="Distracting Elements to Remove" value={form.distractingElements} />
        </View>

        <View style={s.section}>
          <SectionHead num={5} title="Project Scope & Investment Evaluation" />
          <Chips label="Estimated Scope" options={["Light Refresh", "Partial Transformation", "Full HAVENLY Signature Experience"]} selected={form.estimatedScope ? [form.estimatedScope] : []} />
          <TextBlock label="Consultant Notes" value={form.consultantNotes} />

          <View style={s.sigRow}>
            <View style={s.sigBlock}>
              <Field label="Client Name" value={form.clientSignName} />
              <Field label="Date" value={form.clientSignDate} />
            </View>
            <View style={s.sigBlock}>
              <Field label="Consultant Name" value={form.consultantSignName} />
              <Field label="Date" value={form.consultantSignDate} />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={s.label}>Client Signature</Text>
            <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: c.text }} />
          </View>
        </View>

        <PageFooter page={3} total={3} />
      </Page>
    </Document>
  );
}
