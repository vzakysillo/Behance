import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = String(process.env.RESEND_FROM_MAIL);

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const verifyUrl = `${process.env.APP_URL}/auth/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Confirm your email</h2>
        <p>Click the button below to verify your address. The link expires in 24 hours.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 24px;background:#000;color:#fff;
                  text-decoration:none;border-radius:6px;font-weight:600">
          Verify Email
        </a>
        <p style="margin-top:24px;color:#666;font-size:13px">
          Or copy this link: <br/><a href="${verifyUrl}">${verifyUrl}</a>
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}