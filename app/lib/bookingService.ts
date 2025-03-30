import { notificationService } from './notificationService'

export interface Booking {
  id: string
  customerName: string
  date: string
  package: string
  status: 'Pending' | 'Confirmed' | 'Cancelled'
  phone: string
  email: string
  amount: number
  advancePaid: boolean
  assignedStaff: string[]
  requirements: string
  createdAt: string
  updatedAt: string
}

interface BookingService {
  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking>
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking>
  getBookings(): Promise<Booking[]>
  getBookingById(id: string): Promise<Booking | null>
  deleteBooking(id: string): Promise<void>
}

class MockBookingService implements BookingService {
  private bookings: Booking[] = [
    {
      id: 'B001',
      customerName: 'John & Sarah',
      date: '2024-06-15',
      package: 'Premium Wedding Package',
      status: 'Confirmed',
      phone: '+1234567890',
      email: 'john@example.com',
      amount: 2500,
      advancePaid: true,
      assignedStaff: ['Mike', 'Emma'],
      requirements: 'Traditional ceremony + Reception',
      createdAt: '2024-01-28T10:00:00Z',
      updatedAt: '2024-01-28T10:00:00Z'
    }
  ]

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: `B${String(this.bookings.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.bookings.push(newBooking)

    // Notify admin about new booking
await notificationService.notifyAdmin({
  ...newBooking,
  status: newBooking.status.toLowerCase() as 'completed' | 'confirmed' | 'pending'
})

    // Send confirmation to customer
    await notificationService.sendEmail(
      newBooking.email,
      'Booking Confirmation',
      `Thank you for booking with us! Your booking ID is ${newBooking.id}`
    )

    // Send SMS confirmation
    await notificationService.sendSMS(
      newBooking.phone,
      `Your wedding photography booking is confirmed! ID: ${newBooking.id}`
    )

    return newBooking
  }

  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking> {
    const index = this.bookings.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Booking not found')

    const updatedBooking: Booking = {
      ...this.bookings[index],
      ...bookingData,
      updatedAt: new Date().toISOString()
    }

    this.bookings[index] = updatedBooking

    // Notify assigned staff about updates
    updatedBooking.assignedStaff.forEach(staffId => {
      notificationService.notifyStaff(
        staffId,
        `Booking ${id} has been updated. Please check the details.`
      )
    })

    return updatedBooking
  }

  async getBookings(): Promise<Booking[]> {
    return this.bookings
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookings.find(b => b.id === id) || null
  }

  async deleteBooking(id: string): Promise<void> {
    const index = this.bookings.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Booking not found')

    this.bookings.splice(index, 1)
  }
}

export const bookingService = new MockBookingService()