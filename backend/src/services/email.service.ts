import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = String(process.env.RESEND_FROM_MAIL);

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verifyUrl = `${process.env.FRONTEND_URI}/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Inter',system-ui,-apple-system,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:60px 20px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="padding:40px 40px 0 40px;text-align:center;">
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <div style="width:32px;height:32px;border-radius:50%;border:3px solid #575656;"></div>
                      <span style="font-size:18px;font-weight:600;color:#525252;letter-spacing:-0.01em;">LOGO</span>
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 40px 16px 40px;text-align:center;">
                    <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:700;color:#525252;line-height:1.3;">
                      Confirm your email
                    </h1>
                    <p style="margin:0 0 32px 0;font-size:15px;color:#575656;line-height:1.5;">
                      Click the button below to verify your email address.<br/>
                      This link expires in 1 hour.
                    </p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td style="padding:0 40px 40px 40px;text-align:center;">
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 40px;background:#525252;color:#ffffff;
                              text-decoration:none;border-radius:0;font-weight:500;font-size:15px;
                              letter-spacing:0.01em;">
                      Verify Email
                    </a>
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td style="padding:0 40px 40px 40px;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#999999;line-height:1.5;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:8px 0 0 0;font-size:13px;word-break:break-all;">
                      <a href="${verifyUrl}" style="color:#575656;text-decoration:underline;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="480" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 0;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
