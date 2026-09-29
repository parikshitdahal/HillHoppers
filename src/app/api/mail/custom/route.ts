import { NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/mail';

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phone = '',
      days,
      startDate = '',
      endDate = '',
      destinations = [],
      stayType = '',
      message = '',
    } = await req.json();

    if (!name || !email || !phone || !days || !Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing name, email, phone, days, or destinations.' }, { status: 400 });
    }

    const html = `
      <h2>Custom Package Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Days:</strong> ${days}</p>
      ${startDate ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
      ${endDate ? `<p><strong>End Date:</strong> ${endDate}</p>` : ''}
      <p><strong>Destinations:</strong> ${destinations.join(', ')}</p>
      ${stayType ? `<p><strong>Stay Type:</strong> ${stayType}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
    `;
    const text = `Custom Package Request
Name: ${name}
Email: ${email}
Phone: ${phone}\nDays: ${days}
${startDate ? `Start Date: ${startDate}\n` : ''}${endDate ? `End Date: ${endDate}\n` : ''}
Destinations: ${destinations.join(', ')}
${stayType ? `Stay Type: ${stayType}\n` : ''}${message ? `Message: ${message}\n` : ''}
`;

    await sendMail({
      subject: `[Custom] ${name} - ${days} days`,
      html,
      text,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[CUSTOM MAIL ERROR]', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
