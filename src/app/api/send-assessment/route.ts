import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { formData, recipientEmail } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    // Build a clean HTML summary of the assessment
    const html = buildEmailHtml(formData);

    const { error } = await resend.emails.send({
      from: "HAVENLY <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `HAVENLY Premium Assessment — ${formData.clientName || "Client"}`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

function buildEmailHtml(form: Record<string, unknown>): string {
  const rooms = form.rooms as Record<string, { ratings: Record<string, number>; action: string }> | undefined;
  const homeFeel = (form.homeFeel as string[]) || [];
  const buyerProfile = (form.buyerProfile as string[]) || [];

  let roomRows = "";
  if (rooms) {
    for (const [room, data] of Object.entries(rooms)) {
      const ratings = Object.values(data.ratings || {}).map((v) => `<td style="text-align:center;padding:8px;border:1px solid #E8DFD4;">${v || "—"}</td>`).join("");
      roomRows += `<tr><td style="padding:8px;border:1px solid #E8DFD4;font-weight:500;">${room}</td>${ratings}<td style="padding:8px;border:1px solid #E8DFD4;">${data.action || "—"}</td></tr>`;
    }
  }

  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#3D3225;">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #8B7355;">
        <h1 style="font-size:32px;font-weight:300;letter-spacing:6px;margin:0;">HAVENLY</h1>
        <p style="font-size:12px;letter-spacing:4px;color:#9B8E80;margin:4px 0 0;">MAKE YOUR HOME A HAVEN</p>
        <p style="font-style:italic;color:#6B5D4F;margin-top:10px;">Premium In-Person Assessment</p>
      </div>

      <div style="padding:20px 0;">
        <h2 style="color:#8B7355;font-size:16px;letter-spacing:2px;border-bottom:1px solid #E8DFD4;padding-bottom:8px;">1. CLIENT PROFILE</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#8B7355;width:160px;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Name</td><td style="padding:6px 0;">${form.clientName || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Contact</td><td style="padding:6px 0;">${form.contactNumber || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:6px 0;">${form.email || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Location</td><td style="padding:6px 0;">${form.propertyLocation || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Type</td><td style="padding:6px 0;">${form.propertyType || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Size</td><td style="padding:6px 0;">${form.sqft || "—"} sq ft | ${form.bedrooms || "—"} Bed | ${form.bathrooms || "—"} Bath</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Status</td><td style="padding:6px 0;">${form.homeStatus || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Objective</td><td style="padding:6px 0;">${form.primaryObjective || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Timeline</td><td style="padding:6px 0;">${form.timeline || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Investment</td><td style="padding:6px 0;">${form.investmentRange || "—"}</td></tr>
        </table>
      </div>

      <div style="padding:20px 0;">
        <h2 style="color:#8B7355;font-size:16px;letter-spacing:2px;border-bottom:1px solid #E8DFD4;padding-bottom:8px;">2. VISION & LIFESTYLE</h2>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Home Feel:</strong> ${homeFeel.join(", ") || "—"}</p>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Frustrations:</strong> ${form.frustrations || "—"}</p>
      </div>

      <div style="padding:20px 0;">
        <h2 style="color:#8B7355;font-size:16px;letter-spacing:2px;border-bottom:1px solid #E8DFD4;padding-bottom:8px;">3. ROOM-BY-ROOM ASSESSMENT</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr style="background:#8B7355;color:white;">
            <th style="padding:8px;text-align:left;">Space</th>
            <th style="padding:8px;text-align:center;">Cond.</th>
            <th style="padding:8px;text-align:center;">Clutter</th>
            <th style="padding:8px;text-align:center;">Storage</th>
            <th style="padding:8px;text-align:center;">Visual</th>
            <th style="padding:8px;text-align:center;">Light</th>
            <th style="padding:8px;text-align:left;">Action</th>
          </tr>
          ${roomRows}
        </table>
      </div>

      <div style="padding:20px 0;">
        <h2 style="color:#8B7355;font-size:16px;letter-spacing:2px;border-bottom:1px solid #E8DFD4;padding-bottom:8px;">4. STAGING EVALUATION</h2>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Buyer Profile:</strong> ${buyerProfile.join(", ") || "—"}</p>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Selling Features:</strong> ${form.sellingFeatures || "—"}</p>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Distracting Elements:</strong> ${form.distractingElements || "—"}</p>
      </div>

      <div style="padding:20px 0;">
        <h2 style="color:#8B7355;font-size:16px;letter-spacing:2px;border-bottom:1px solid #E8DFD4;padding-bottom:8px;">5. PROJECT SCOPE</h2>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Scope:</strong> ${form.estimatedScope || "—"}</p>
        <p><strong style="color:#8B7355;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Notes:</strong> ${form.consultantNotes || "—"}</p>
      </div>

      <div style="padding:20px 0;border-top:2px solid #8B7355;font-size:13px;color:#6B5D4F;">
        <p>Client: ${form.clientSignName || "—"} &nbsp;|&nbsp; Date: ${form.clientSignDate || "—"}</p>
        <p>Consultant: ${form.consultantSignName || "—"} &nbsp;|&nbsp; Date: ${form.consultantSignDate || "—"}</p>
      </div>
    </div>
  `;
}
