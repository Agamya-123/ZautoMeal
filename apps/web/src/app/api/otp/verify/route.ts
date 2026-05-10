import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !serviceSid) {
      // Fallback for development
      if (code === '1234') {
         return NextResponse.json({ success: true, status: 'approved' });
      }
      return NextResponse.json({ error: 'Invalid mock code. Try 1234.' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code: code });

    if (verificationCheck.status === 'approved') {
      return NextResponse.json({ success: true, status: 'approved' });
    } else {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify OTP' }, { status: 500 });
  }
}
