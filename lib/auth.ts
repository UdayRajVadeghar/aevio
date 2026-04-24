import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

async function sendAuthEmail({
  to,
  subject,
  html,
  context,
}: {
  to: string;
  subject: string;
  html: string;
  context: "reset password" | "verification";
}) {
  if (!resend || !emailFrom) {
    console.error(
      `[auth] Skipping ${context} email: missing RESEND_API_KEY or EMAIL_FROM`
    );
    return;
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`[auth] Failed to send ${context} email`, error);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log("Sending reset password email to", user.email);
      await sendAuthEmail({
        to: user.email,
        subject: "Reset your password",
        context: "reset password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px;">Reset Password</a>
            <p>This link will expire in 5 minutes.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Verify your email",
        context: "verification",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Aevio!</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px;">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      });
    },
    sendOnSignUp: true,
  },
});

export type Session = typeof auth.$Infer.Session;
