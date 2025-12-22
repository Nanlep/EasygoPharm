import { Resend } from 'resend';
import twilio from 'twilio';

// Use env fallbacks to ensure local dev doesn't crash on missing keys
const resendApiKey = process.env.RESEND_API_KEY;
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;

const resend = resendApiKey ? new Resend(resendApiKey) : null;
const twilioClient = (twilioSid && twilioToken) ? (twilio as any)(twilioSid, twilioToken) : null;

/**
 * Sanitizes phone numbers for Twilio WhatsApp format
 */
const sanitizePhone = (phone: string) => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Data payload required' });

  const results: any = { emailUser: null, emailAdmin: null, whatsapp: null };
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL || data.contactEmail;

  try {
    if (type === 'DRUG_REQUEST') {
      // 1. Email to User
      if (resend) {
        try {
          results.emailUser = await resend.emails.send({
            from: `EasygoPharm <${fromEmail}>`,
            to: data.contactEmail,
            subject: `Request Received: ${data.genericName}`,
            html: `<h3>Submission Confirmed</h3><p>Hello ${data.requesterName}, we have received your sourcing request for <b>${data.genericName}</b>. Our team is currently reviewing global inventory.</p>`
          });
        } catch (e: any) { console.warn("User Email Error:", e.message); }

        try {
          results.emailAdmin = await resend.emails.send({
            from: `EasygoPharm System <${fromEmail}>`,
            to: adminEmail,
            subject: `[URGENT: ${data.urgency}] New Sourcing Request`,
            text: `New request from ${data.requesterName}. Drug: ${data.genericName}. Contact: ${data.contactEmail}`
          });
        } catch (e: any) { console.warn("Admin Email Error:", e.message); }
      }

      // 2. WhatsApp to User
      if (data.contactPhone && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        try {
          const formattedPhone = sanitizePhone(data.contactPhone);
          results.whatsapp = await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            body: `EasygoPharm: Your request for ${data.genericName} is now in our tracking pipeline. Sourcing ID: ${data.id.slice(-6)}`
          });
        } catch (e: any) { console.warn("WhatsApp Error:", e.message); }
      }
    }

    if (type === 'CONSULTATION') {
      if (resend) {
        try {
          results.emailUser = await resend.emails.send({
            from: `EasygoPharm Support <${fromEmail}>`,
            to: data.contactEmail,
            subject: `Appointment Confirmed: EasygoPharm Triage`,
            html: `<p>Hello ${data.patientName}, your consultation is confirmed for ${new Date(data.preferredDate).toLocaleString()}. A specialist will contact you via WhatsApp at the scheduled time.</p>`
          });
        } catch (e: any) { console.warn("Consultation Email Error:", e.message); }
      }

      if (data.contactPhone && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        try {
          const formattedPhone = sanitizePhone(data.contactPhone);
          results.whatsapp = await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            body: `EasygoPharm: Your medical consultation is confirmed for ${new Date(data.preferredDate).toLocaleDateString()} at ${new Date(data.preferredDate).toLocaleTimeString()}.`
          });
        } catch (e: any) { console.warn("Consultation WhatsApp Error:", e.message); }
      }
    }

    return res.status(200).json({ success: true, details: results });
  } catch (error: any) {
    console.error('Notification worker failure:', error);
    return res.status(500).json({ error: error.message });
  }
}