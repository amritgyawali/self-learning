import { smsService } from './smsService'

interface Booking {
  id?: string;
  customerName: string;
  date: string;
  package: string;
  amount: number;
  phone?: string;
  location?: string;
  status?: 'pending' | 'confirmed' | 'completed';
}

interface NotificationService {
  sendSMS(phone: string, message: string): Promise<void>
  sendEmail(email: string, subject: string, message: string): Promise<void>
  notifyAdmin(booking: Booking): Promise<void>
  notifyStaff(staffId: string, message: string): Promise<void>
}

class MockNotificationService implements NotificationService {
  async sendSMS(phone: string, message: string): Promise<void> {
    await smsService.sendSMS(phone, message)
  }

  async sendEmail(email: string, subject: string, message: string): Promise<void> {
    console.log(`[Email] Sending to ${email}: ${subject}`)
    // In production, integrate with email service like SendGrid
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: email,
    //   from: 'your@email.com',
    //   subject: subject,
    //   text: message,
    // })
  }

  async notifyAdmin(booking: Booking): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPhone = process.env.ADMIN_PHONE || '+1234567890'

    // Send email notification
    const subject = 'New Booking Notification'
    const message = `
      New booking received:
      Customer: ${booking.customerName}
      Date: ${booking.date}
      Package: ${booking.package}
      Amount: $${booking.amount}
      ${booking.phone ? `Phone: ${booking.phone}` : ''}
      ${booking.location ? `Location: ${booking.location}` : ''}
      Status: ${booking.status || 'pending'}
    `
    await this.sendEmail(adminEmail, subject, message)

    // Send SMS notification
    const smsMessage = `New booking: ${booking.customerName} for ${booking.package} on ${booking.date}. Check dashboard for details.`
    await this.sendSMS(adminPhone, smsMessage)

    // If customer provided phone, send confirmation
    if (booking.phone) {
      await smsService.sendBookingConfirmation(booking.phone, {
        id: booking.id || 'TBD',
        customerName: booking.customerName,
        date: booking.date,
        package: booking.package
      })
    }
  }

  async notifyStaff(staffId: string, message: string): Promise<void> {
    console.log(`[Staff Notification] Sending to ${staffId}: ${message}`)
    // In production, implement staff notification system
    // Could be through email, SMS, or a dedicated staff app
  }
}

export const notificationService = new MockNotificationService()