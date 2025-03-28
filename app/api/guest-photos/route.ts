import { NextRequest, NextResponse } from 'next/server'
import * as faceapi from 'face-api.js'
import { Twilio } from 'twilio'

// Initialize Twilio client (in production, use environment variables)
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

interface PhotoUploadBody {
  photo: File
  name: string
  phone: string
  email?: string
  eventId: string
  filters: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
  }
  shareOptions: {
    whatsapp: boolean
    email: boolean
    download: boolean
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const photo = formData.get('photo') as File
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const eventId = formData.get('eventId') as string
    const filters = JSON.parse(formData.get('filters') as string)
    const shareOptions = JSON.parse(formData.get('shareOptions') as string)

    // Process photo with face recognition
    const blob = new Blob([await photo.arrayBuffer()], { type: photo.type });
    const img = await faceapi.bufferToImage(blob);
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()

    if (detections.length === 0) {
      return NextResponse.json(
        { error: 'No faces detected in the photo' },
        { status: 400 }
      )
    }

    // Store photo and metadata (in production, use a proper database and storage service)
    const photoUrl = `https://example.com/photos/${eventId}/${photo.name}`

    // Share photo via WhatsApp if enabled
    if (shareOptions.whatsapp) {
      await twilioClient.messages.create({
        body: `Hi ${name}! Here are your photos from the event: ${photoUrl}`,
        from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
        to: `whatsapp:${phone}`
      })
    }

    // Share photo via email if enabled
    if (shareOptions.email && email) {
      // Implement email sending logic here
    }

    return NextResponse.json({
      success: true,
      message: 'Photo processed and shared successfully',
      photoUrl
    })
  } catch (error) {
    console.error('Error processing photo:', error)
    return NextResponse.json(
      { error: 'Failed to process photo' },
      { status: 500 }
    )
  }
}