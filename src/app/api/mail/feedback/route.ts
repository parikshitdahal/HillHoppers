import { NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/mail';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const trip = String(formData.get('trip') || 'HillHoppers journey').trim();
    const rating = String(formData.get('rating') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const files = formData.getAll('media').filter((item): item is File => {
      return typeof item === 'object' && item !== null && 'arrayBuffer' in item && 'name' in item && 'size' in item && Number(item.size) > 0;
    });

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing name, email, phone, or feedback message.' },
        { status: 400 },
      );
    }

    const attachments = await Promise.all(
      files.slice(0, 4).map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      })),
    );

    const html = `
      <h2>Client Feedback</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Trip:</strong> ${trip}</p>
      ${rating ? `<p><strong>Rating:</strong> ${rating}/5</p>` : ''}
      <p><strong>Feedback:</strong><br/>${message}</p>
      ${attachments.length ? `<p><strong>Uploaded media:</strong> ${attachments.length} file(s) attached.</p>` : ''}
    `;

    const text = `Client Feedback
Name: ${name}
Email: ${email}
Phone: ${phone}
Trip: ${trip}
${rating ? `Rating: ${rating}/5\n` : ''}Feedback: ${message}
${attachments.length ? `Uploaded media: ${attachments.length} file(s) attached.\n` : ''}`;

    await sendMail({
      subject: `[Feedback] ${trip} - ${name}`,
      html,
      text,
      replyTo: email,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[FEEDBACK MAIL ERROR]', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
