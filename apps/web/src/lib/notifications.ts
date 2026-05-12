import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendWhatsAppNotification(to: string, message: string) {
  try {
    // Only send if credentials are valid, otherwise mock it for trial
    if (!accountSid || !authToken || accountSid.includes('your_')) {
      console.log(`[MOCK WHATSAPP] To: ${to} | Msg: ${message}`);
      return { success: true, mock: true };
    }

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER || '+14155238886'}`, // Twilio Sandbox number
      to: `whatsapp:${to}`
    });

    console.log(`[TWILIO] Message sent: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('[TWILIO ERROR]', error);
    return { success: false, error };
  }
}

export async function logWarehouseAlert(itemId: string, itemName: string, reason: string) {
  // We'll hit our internal warehouse API to log this alert
  try {
    await fetch(`${process.env.NEXTAUTH_URL}/api/warehouse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'LOG_ALERT', 
        alert: { 
          id: itemId, 
          name: itemName, 
          reason, 
          timestamp: new Date().toISOString() 
        } 
      })
    });
  } catch (e) {
    console.log(`[INTERNAL ALERT] Stockout: ${itemName} (${reason})`);
  }
}
