import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const eventName = searchParams.get('eventName');

    if (!eventId || !eventName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate the URL for the guest photos upload page
    const uploadPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/live-weddings/guest-photos/upload?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}`;

    // Generate QR code as SVG
    const qrCodeSvg = await QRCode.toString(uploadPageUrl, {
      type: 'svg',
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H'
    });

    return new NextResponse(qrCodeSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}