import { NextRequest, NextResponse } from 'next/server'

const API_TOKEN = process.env.AQICN_API_TOKEN

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    )
  }

  if (!API_TOKEN) {
    return NextResponse.json(
      { error: 'AQICN API token not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${API_TOKEN}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data')
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      throw new Error(data.data || 'Invalid API response')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error fetching forecast data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    )
  }
}
