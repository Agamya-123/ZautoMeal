/**
 * Notification Service
 * Dispatches alerts via WhatsApp, FCM Push, SMS, Email
 * Priority: WhatsApp → FCM → SMS → Email
 */

type NotificationChannel = 'whatsapp' | 'fcm' | 'sms' | 'email';

interface NotifyOptions {
  userId:  string;
  phone?:  string;
  fcmToken?: string;
  email?:  string;
  message: string;
  channel?: NotificationChannel;
  actions?: string[]; // e.g. ['CONFIRM', 'SKIP', 'RESCHEDULE']
}

class NotificationService {

  async send(opts: NotifyOptions): Promise<void> {
    const channel = opts.channel || 'fcm';

    switch (channel) {
      case 'whatsapp': return this.sendWhatsApp(opts);
      case 'fcm':      return this.sendPush(opts);
      case 'sms':      return this.sendSMS(opts);
      case 'email':    return this.sendEmail(opts);
    }
  }

  // ── WhatsApp ────────────────────────────────────────────
  private async sendWhatsApp(opts: NotifyOptions): Promise<void> {
    console.log(`[WhatsApp] → ${opts.phone}: ${opts.message}`);

    // TODO: Integrate Twilio WhatsApp / 360dialog:
    // await twilioClient.messages.create({
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to:   `whatsapp:${opts.phone}`,
    //   body: opts.message,
    // });
  }

  // ── FCM Push ────────────────────────────────────────────
  private async sendPush(opts: NotifyOptions): Promise<void> {
    console.log(`[FCM] → token:${opts.fcmToken?.slice(0, 10)}...: ${opts.message}`);

    // TODO: Integrate Firebase Admin SDK:
    // await admin.messaging().send({
    //   token: opts.fcmToken!,
    //   notification: { title: 'Zautomeal 🍽️', body: opts.message },
    //   data: { actions: JSON.stringify(opts.actions) },
    // });
  }

  // ── SMS ─────────────────────────────────────────────────
  private async sendSMS(opts: NotifyOptions): Promise<void> {
    console.log(`[SMS] → ${opts.phone}: ${opts.message}`);

    // TODO: Integrate Twilio SMS:
    // await twilioClient.messages.create({
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to:   opts.phone!,
    //   body: opts.message,
    // });
  }

  // ── Email ───────────────────────────────────────────────
  private async sendEmail(opts: NotifyOptions): Promise<void> {
    console.log(`[Email] → ${opts.email}: ${opts.message}`);

    // TODO: Integrate Resend/Nodemailer
  }

  // ── Pre-order Alert (1 hour before) ─────────────────────
  async sendPreOrderAlert(userId: string, scheduleLabel: string, restaurantName: string): Promise<void> {
    await this.send({
      userId,
      message: `🍽️ Your "${scheduleLabel}" from ${restaurantName} is being placed in 1 hour. Reply YES to confirm, SKIP to cancel, or RESCHEDULE.`,
      actions: ['CONFIRM', 'SKIP', 'RESCHEDULE'],
    });
  }

  // ── Order Placed Confirmation ─────────────────────────────
  async sendOrderPlaced(userId: string, orderId: string, eta: string): Promise<void> {
    await this.send({
      userId,
      message: `✅ Order placed! (ID: ${orderId}). Estimated delivery: ${eta}. Track: https://zautomeal.app/track/${orderId}`,
    });
  }
}

export const notificationService = new NotificationService();
