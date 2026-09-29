import nodemailer, { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP configuration missing. Check .env.local (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).');
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // TLS for 465, STARTTLS for others
    auth: { user, pass },
  });

  return cachedTransporter;
}

export async function sendMail({
  subject,
  html,
  text,
  to,
  replyTo,
  from,
  attachments,
}: {
  subject: string;
  html: string;
  text?: string;
  to?: string;
  replyTo?: string;
  from?: string;
  attachments?: Mail.Attachment[];
}) {
  const transporter = getTransporter();
  const defaultFrom = from || `"${process.env.SITE_NAME || 'Website'}" <${process.env.SMTP_USER}>`;
  const defaultTo = to || process.env.MAIL_TO || process.env.SMTP_USER;

  if (!defaultTo) {
    throw new Error('No MAIL_TO or SMTP_USER configured for mail destination.');
  }

  return transporter.sendMail({
    from: defaultFrom,
    to: defaultTo,
    subject,
    html,
    text,
    replyTo,
    attachments,
  });
}
