import twilio from 'twilio'

interface SMSConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

class SMSService {
  private client: any
  private fromNumber: string

  constructor(config: SMSConfig) {
    this.client = twilio(config.accountSid, config.authToken)
    this.fromNumber = config.fromNumber
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.client.messages.create({
          body: message,
          to,
          from: this.fromNumber
        })
      } else {
        // In development, just log the message
        console.log(`[DEV SMS] To: ${to}, Message: ${message}`)
      }
    } catch (error) {
      console.error('SMS sending failed:', error)
      throw new Error('Failed to send SMS')
    }
  }

  async sendBookingConfirmation(phone: string, booking: {
    id: string
    customerName: string
    date: string
    package: string
  }): Promise<void> {
    const message = `Thank you for booking with us, ${booking.customerName}!

Booking Details:
Booking ID: ${booking.id}
Date: ${booking.date}
Package: ${booking.package}

We'll be in touch soon with more details.`

    await this.sendSMS(phone, message)
  }

  async sendStaffNotification(phone: string, booking: {
    customerName: string
    date: string
    package: string
    location?: string
  }): Promise<void> {
    const message = `New Booking Alert!

Customer: ${booking.customerName}
Date: ${booking.date}
Package: ${booking.package}
${booking.location ? `Location: ${booking.location}` : ''}

Please check the dashboard for more details.`

    await this.sendSMS(phone, message)
  }
}

// Initialize with environment variables
export const smsService = new SMSService({
  accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_account_sid',
  authToken: process.env.TWILIO_AUTH_TOKEN || 'your_auth_token',
  fromNumber: process.env.TWILIO_FROM_NUMBER || 'your_twilio_number'
})