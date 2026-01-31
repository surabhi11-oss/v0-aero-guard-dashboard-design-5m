import { NextResponse } from 'next/server'

const API_TOKEN = process.env.AQICN_API_TOKEN

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
  }

  if (!API_TOKEN) {
    return NextResponse.json(
      { error: 'API token not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.waqi.info/search/?token=${API_TOKEN}&keyword=${encodeURIComponent(keyword)}`
    )

    if (!response.ok) {
      throw new Error('Failed to search locations')
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      return NextResponse.json(
        { error: 'Failed to search locations' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching locations:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}
