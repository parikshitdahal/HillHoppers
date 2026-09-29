import { NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/mail';

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phone = '',
      packageTitle,
      packageDuration = '',
      startDate = '',
      endDate = '',
      stayType = '',          // ← NEW
      message = '',
    } = await req.json();

    if (!name || !email || !phone || !packageTitle) {
      return NextResponse.json(
        { success: false, error: 'Missing name, email, phone, or packageTitle.' },
        { status: 400 }
      );
    }

    const html = `
      <h2>Curated Package Booking</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Package:</strong> ${packageTitle}</p>
      ${packageDuration ? `<p><strong>Duration:</strong> ${packageDuration}</p>` : ''}
      ${startDate ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
      ${endDate ? `<p><strong>End Date:</strong> ${endDate}</p>` : ''}
      ${stayType ? `<p><strong>Stay Type:</strong> ${stayType}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
    `;

    const text = `Curated Package Booking
Name: ${name}
Email: ${email}
Phone: ${phone}\nPackage: ${packageTitle}
${packageDuration ? `Duration: ${packageDuration}\n` : ''}${startDate ? `Start Date: ${startDate}\n` : ''}${endDate ? `End Date: ${endDate}\n` : ''}${stayType ? `Stay Type: ${stayType}\n` : ''}${message ? `Message: ${message}\n` : ''}
`;

    await sendMail({
      subject: `[Booking] ${packageTitle}${stayType ? ` (${stayType})` : ''} - ${name}`,
      html,
      text,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[BOOKING MAIL ERROR]', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
