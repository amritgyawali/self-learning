import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
// Remove direct import of face-api to avoid server-side issues
import { Twilio } from 'twilio'

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const photo = formData.get('photo') as File
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const eventId = formData.get('eventId') as string

    if (!photo || !name || !phone || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create event directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', eventId)
    await createDirIfNotExists(uploadDir)

    // Generate unique filename
    const filename = `${Date.now()}-${photo.name}`
    const filepath = path.join(uploadDir, filename)

    // Convert File to Buffer and save
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, new Uint8Array(buffer))

    // Get face detection results from client-side processing
    const faceDetected = formData.get('faceDetected') === 'true'
    const faceDescriptor = formData.get('faceDescriptor') as string
    
    if (!faceDetected) {
      return NextResponse.json(
        { error: 'No faces detected in the photo' },
        { status: 400 }
      )
    }

    // Store face descriptors for future matching
    const faceData = {
      name,
      phone,
      faceDescriptor: faceDescriptor || '',
      photoUrl: `/uploads/${eventId}/${filename}`
    }

    // Save face data to database (implement your database logic here)
    // For demo, we'll just send the WhatsApp message

    // Send WhatsApp message with photo link
    const photoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${eventId}/${filename}`
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      body: `Hi ${name}! Here's your photo from the event: ${photoUrl}`,
      mediaUrl: [photoUrl]
    })

    return NextResponse.json({ success: true, photoUrl })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(dir, '', { flag: 'wx' })
  } catch (error) {
    // Directory already exists or error occurred
  }
}