import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email: string, resetUrl: string): Promise<string> => {
    let transporter;
    
    // Check if SMTP details are in env
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === "465",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Dynamic ethereal fallback
        console.log("📨 Generating Ethereal Mail test credentials...");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const mailOptions = {
        from: '"ShowOff Platform" <no-reply@showoff.dev>',
        to: email,
        subject: "Password Reset Request - ShowOff",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #6366f1; text-align: center; margin-bottom: 24px;">ShowOff Password Reset</h2>
                <p style="font-size: 15px; color: #334155; line-height: 1.5;">Hi,</p>
                <p style="font-size: 15px; color: #334155; line-height: 1.5;">We received a request to reset the password for your ShowOff developer account. Click the button below to establish a new password. This reset link is only valid for <strong>5 minutes</strong>.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Reset Password</a>
                </div>
                <p style="font-size: 13px; color: #64748b; line-height: 1.5;">If the button above does not work, copy and paste the link below into your browser:</p>
                <p style="font-size: 12px; color: #3b82f6; word-break: break-all; margin-bottom: 24px;">${resetUrl}</p>
                <p style="font-size: 15px; color: #334155; line-height: 1.5;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <div style="color: #94a3b8; font-size: 11px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
                    This is an automated system email. Please do not reply.
                </div>
            </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If using ethereal, return the test preview URL
    if (!process.env.SMTP_HOST) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        return previewUrl || "";
    }
    
    return "";
};
