'use client'

import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface Station {
  uid: number
  name: string
  lat: number
  lon: number
  aqi: number
  time: string
}

interface AirQualityMapProps {
  stations: Station[]
  center?: [number, number]
  zoom?: number
  className?: string
  height?: string
}

export function AirQualityMap({ 
  stations, 
  center = [19.113405637156333, 72.93278607789993], 
  zoom = 12,
  className = '', 
  height = '100%' 
}: AirQualityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const circlesRef = useRef<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [leaflet, setLeaflet] = useState<any>(null)

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#22c55e' // green
    if (aqi <= 100) return '#eab308' // yellow
    if (aqi <= 150) return '#f97316' // orange
    if (aqi <= 200) return '#ef4444' // red
    return '#dc2626' // dark red
  }

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy'
    if (aqi <= 200) return 'Very Unhealthy'
    return 'Hazardous'
  }

  // Initialize map once
  useEffect(() => {
    let mounted = true

    const initMap = async () => {
      try {
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        if (!mounted || !mapRef.current) return
        if (mapInstanceRef.current) return

        setLeaflet(L.default)

        const map = L.default.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
        })

        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map
        setIsLoading(false)
      } catch (err) {
        console.error('Error initializing map:', err)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update map center when it changes
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return
    mapInstanceRef.current.setView(center, zoom)
  }, [center, zoom])

  // Update markers when stations change
  useEffect(() => {
    if (!mapInstanceRef.current || !leaflet || isLoading) return

    const L = leaflet
    const map = mapInstanceRef.current

    // Clear existing markers and circles
    markersRef.current.forEach(marker => map.removeLayer(marker))
    circlesRef.current.forEach(circle => map.removeLayer(circle))
    markersRef.current = []
    circlesRef.current = []

    // Add new markers
    stations.forEach(station => {
      const color = getAQIColor(station.aqi)
      
      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-aqi-marker',
        html: `
          <div style="
            background-color: ${color}; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
          ">${station.aqi}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      // Add marker
      const marker = L.marker([station.lat, station.lon], { icon }).addTo(map)
      
      // Add popup with AQI details
      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 8px; min-width: 200px;">
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: #1f2937;">${station.name}</h3>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: ${color};">${station.aqi}</span>
            <span style="
              background-color: ${color}; 
              color: white; 
              padding: 4px 12px; 
              border-radius: 8px; 
              font-size: 12px; 
              font-weight: 600;
            ">${getAQIStatus(station.aqi)}</span>
          </div>
          <div style="font-size: 11px; color: #6b7280;">
            <p style="margin: 0;">Lat: ${station.lat.toFixed(4)}°</p>
            <p style="margin: 0;">Lon: ${station.lon.toFixed(4)}°</p>
          </div>
        </div>
      `)

      markersRef.current.push(marker)

      // Add circle overlay for heatmap effect
      const circle = L.circle([station.lat, station.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.15,
        radius: 1500,
        weight: 0,
      }).addTo(map)

      circlesRef.current.push(circle)
    })

    // Fit bounds if multiple stations
    if (stations.length > 1) {
      const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lon]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [stations, leaflet, isLoading])

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/50">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
