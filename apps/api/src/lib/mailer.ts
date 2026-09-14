import { env } from '../env.js';

export interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export type Mailer = (email: Email) => Promise<void>;

/** Emails sent while no provider is configured, so tests and local dev can read the links. */
export const outbox: Email[] = [];

async function sendWithResend(email: Email) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: email.to, subject: email.subject, html: email.html, text: email.text }),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
}

/**
 * Sends through Resend when RESEND_API_KEY is set. Otherwise keeps the email
 * in memory and prints it, which is enough to follow the links locally.
 */
export const sendEmail: Mailer = async (email) => {
  if (env.RESEND_API_KEY) return sendWithResend(email);

  outbox.push(email);
  if (outbox.length > 50) outbox.shift();
  if (env.NODE_ENV !== 'test') {
    console.info(`\n[email:dev] To: ${email.to}\nSubject: ${email.subject}\n${email.text}\n`);
  }
};

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

type Lang = 'es' | 'en';

/** Auth URLs carry the page to return to (e.g. `/en/login`); use it to pick the email language. */
export function languageFromUrl(url: string): Lang {
  try {
    const callback = new URL(url).searchParams.get('callbackURL') ?? '';
    return callback.startsWith('/en') ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

function layout(title: string, body: string, action: { label: string; url: string }, footer: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#08042c;font-family:Arial,sans-serif;color:#e2e8f0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#0f172a;border-radius:16px;padding:32px">
        <tr><td style="font-size:22px;font-weight:bold;color:#ffffff">Watch<span style="color:#5fb3cd">Guru</span></td></tr>
        <tr><td style="padding-top:24px;font-size:20px;font-weight:bold;color:#ffffff">${escapeHtml(title)}</td></tr>
        <tr><td style="padding-top:12px;font-size:15px;line-height:1.5">${body}</td></tr>
        <tr><td style="padding-top:24px">
          <a href="${escapeHtml(action.url)}" style="display:inline-block;background:#5fb3cd;color:#08042c;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:10px">${escapeHtml(action.label)}</a>
        </td></tr>
        <tr><td style="padding-top:24px;font-size:12px;color:#94a3b8">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const copy = {
  reset: {
    es: {
      subject: 'Restablecé tu contraseña de WatchGuru',
      title: 'Restablecer contraseña',
      body: (name: string) => `Hola ${escapeHtml(name)}, recibimos un pedido para cambiar tu contraseña. El link vence en 1 hora.`,
      action: 'Elegir nueva contraseña',
      footer: 'Si no lo pediste, ignorá este email: tu contraseña no va a cambiar.',
    },
    en: {
      subject: 'Reset your WatchGuru password',
      title: 'Reset your password',
      body: (name: string) => `Hi ${escapeHtml(name)}, we got a request to change your password. The link expires in 1 hour.`,
      action: 'Choose a new password',
      footer: "If you didn't ask for this, ignore this email and your password won't change.",
    },
  },
  verify: {
    es: {
      subject: 'Confirmá tu email en WatchGuru',
      title: 'Confirmá tu email',
      body: (name: string) => `Hola ${escapeHtml(name)}, confirmá tu dirección para asegurar tu cuenta y poder recuperarla si olvidás la contraseña.`,
      action: 'Confirmar email',
      footer: 'Si no creaste una cuenta en WatchGuru, ignorá este email.',
    },
    en: {
      subject: 'Confirm your email on WatchGuru',
      title: 'Confirm your email',
      body: (name: string) => `Hi ${escapeHtml(name)}, confirm your address to secure your account and recover it if you forget your password.`,
      action: 'Confirm email',
      footer: "If you didn't create a WatchGuru account, ignore this email.",
    },
  },
};

export function authEmail(kind: keyof typeof copy, user: { email: string; name: string }, url: string): Email {
  const text = copy[kind][languageFromUrl(url)];
  const name = user.name || user.email;
  return {
    to: user.email,
    subject: text.subject,
    html: layout(text.title, text.body(name), { label: text.action, url }, text.footer),
    text: `${text.title}\n\n${text.body(name).replace(/<[^>]+>/g, '')}\n\n${text.action}: ${url}\n\n${text.footer}`,
  };
}
