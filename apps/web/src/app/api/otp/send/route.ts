import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    let { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Ensure E.164 format (e.g. +91...)
    phone = phone.replace(/\s+/g, '');
    if (phone.length === 10 && /^\d+$/.test(phone)) {
      phone = '+91' + phone;
    } else if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !serviceSid) {
      // Fallback for development if credentials are missing
      console.warn("Twilio credentials missing. Pretending OTP was sent.");
      return NextResponse.json({ success: true, message: 'Mock OTP sent (Dev mode)' });
    }

    const client = twilio(accountSid, authToken);

    // Send OTP via SMS
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: 'sms' });

    return NextResponse.json({ success: true, status: verification.status });

  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
