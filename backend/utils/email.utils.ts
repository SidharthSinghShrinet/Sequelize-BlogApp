import { Resend } from "resend";
import { ResetPasswordEmail } from "../emails/ResetPasswordEmail.tsx";

let resendInstance: Resend | null = null;

const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ [Resend] RESEND_API_KEY is not defined in environment variables.");
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
};

/**
 * Sends a password reset email using Resend SDK and React Email template.
 * @param email Recipient email address
 * @param resetUrl Plain text password reset link containing token
 * @returns Resend email dispatch ID or empty string
 */
export const sendResetPasswordEmail = async (
  email: string,
  resetUrl: string
): Promise<string> => {
  const resend = getResendClient();

  // Resend default onboarding sender email for domain verification testing
  const mailFromEmail = process.env.MAIL_FROM_EMAIL || "onboarding@resend.dev";
  const mailFromName = process.env.MAIL_FROM_NAME || "ShowOff";
  const sender = `${mailFromName} <${mailFromEmail}>`;

  if (!resend) {
    console.log("\n========================================================");
    console.log(`📨 [DEV MODE] Reset Password Link for ${email}:`);
    console.log(`🔗  ${resetUrl}`);
    console.log("========================================================\n");
    return "";
  }

  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Password Reset Request - ShowOff",
      react: ResetPasswordEmail({ resetUrl, userEmail: email }),
    });

    if (error) {
      console.error("❌ Resend Email Delivery Error:", error);
      console.log("\n========================================================");
      console.log(`📨 [DEV/TEST LINK] Reset Password URL for ${email}:`);
      console.log(`🔗  ${resetUrl}`);
      console.log("========================================================\n");

      if (process.env.NODE_ENV === "production") {
        throw new Error(`Failed to send email via Resend: ${error.message}`);
      }
      return "dev-fallback-id";
    }

    console.log("\n========================================================");
    console.log(`✉️  [RESEND] Email sent successfully to ${email}`);
    console.log(`🆔  Resend Email ID: ${data?.id}`);
    console.log("========================================================\n");

    return data?.id || "";
  } catch (err: any) {
    console.error("❌ Exception during Resend email dispatch:", err.message || err);
    console.log("\n========================================================");
    console.log(`📨 [DEV/TEST LINK] Reset Password URL for ${email}:`);
    console.log(`🔗  ${resetUrl}`);
    console.log("========================================================\n");

    if (process.env.NODE_ENV === "production") {
      throw err;
    }
    return "dev-fallback-id";
  }
};
