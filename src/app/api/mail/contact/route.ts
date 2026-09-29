import { NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/mail';

export async function POST(req: Request) {
  try {
    const { name, email, phone = '', subject = 'General Enquiry', message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: 'Missing name, email, phone or message.' }, { status: 400 });
    }

    const html = `
      <h2>Contact Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;
    const text = `Contact Enquiry
Name: ${name}
Email: ${email}
Phone: ${phone}\nSubject: ${subject}
Message: ${message}
`;

    await sendMail({
      subject: `[Contact] ${subject} - ${name}`,
      html,
      text,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[CONTACT MAIL ERROR]', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
