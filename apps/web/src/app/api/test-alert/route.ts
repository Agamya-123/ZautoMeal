import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    let { phone, type } = await req.json();

    if (!phone || !type) {
      return NextResponse.json({ error: 'Phone and type are required' }, { status: 400 });
    }

    // Ensure E.164 format
    phone = phone.replace(/\s+/g, '');
    if (phone.length === 10 && /^\d+$/.test(phone)) {
      phone = '+91' + phone;
    } else if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone || fromPhone === 'your_twilio_phone_number_here') {
      return NextResponse.json({ error: 'Twilio phone number is not configured in .env.local' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    if (type === 'sms') {
      await client.messages.create({
        body: '👋 Hello from Zautomeal! Your SMS alerts are now active and working perfectly.',
        from: fromPhone,
        to: phone
      });
    } else if (type === 'whatsapp') {
      await client.messages.create({
        body: '🍔 *Hello from Zautomeal!*\n\nYour WhatsApp alerts are now active. We will notify you here when your next meal is about to be ordered!',
        from: `whatsapp:${fromPhone}`,
        to: `whatsapp:${phone}`
      });
    } else {
      return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${type} sent successfully` });

  } catch (error: any) {
    console.error('Error sending test alert:', error);
    return NextResponse.json({ error: error.message || 'Failed to send alert' }, { status: 500 });
  }
}
