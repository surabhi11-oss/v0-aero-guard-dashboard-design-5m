import { NextRequest, NextResponse } from 'next/server'

const API_TOKEN = process.env.AQICN_API_TOKEN

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
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
    // Fetch multiple nearby stations by searching in a grid pattern
    const radius = 0.1 // degrees (roughly 11km)
    const stations = []

    // Get data from multiple points around the center
    const offsets = [
      { lat: 0, lon: 0 }, // center
      { lat: radius, lon: 0 }, // north
      { lat: -radius, lon: 0 }, // south
      { lat: 0, lon: radius }, // east
      { lat: 0, lon: -radius }, // west
      { lat: radius, lon: radius }, // northeast
      { lat: -radius, lon: radius }, // southeast
      { lat: radius, lon: -radius }, // northwest
      { lat: -radius, lon: -radius }, // southwest
    ]

    const promises = offsets.map(async (offset) => {
      const offsetLat = parseFloat(lat) + offset.lat
      const offsetLon = parseFloat(lon) + offset.lon

      try {
        const response = await fetch(
          `https://api.waqi.info/feed/geo:${offsetLat};${offsetLon}/?token=${API_TOKEN}`,
          { next: { revalidate: 300 } }
        )

        if (!response.ok) return null

        const data = await response.json()
        if (data.status === 'ok' && data.data) {
          return {
            uid: data.data.idx,
            name: data.data.city?.name || 'Unknown Station',
            lat: data.data.city?.geo?.[0] || offsetLat,
            lon: data.data.city?.geo?.[1] || offsetLon,
            aqi: data.data.aqi,
            time: data.data.time?.s || new Date().toISOString(),
          }
        }
        return null
      } catch {
        return null
      }
    })

    const results = await Promise.all(promises)
    const validStations = results.filter((s) => s !== null)

    // Remove duplicates based on uid
    const uniqueStations = Array.from(
      new Map(validStations.map((s) => [s.uid, s])).values()
    )

    return NextResponse.json({ stations: uniqueStations })
  } catch (error) {
    console.error('[v0] Error fetching nearby stations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby stations' },
      { status: 500 }
    )
  }
}
