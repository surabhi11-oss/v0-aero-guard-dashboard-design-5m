'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Wind, 
  MapPin, 
  Settings, 
  TrendingUp,
  Activity,
  AlertCircle,
  Menu,
  X,
  Search,
  Loader2,
  Map as MapIcon,
  Navigation,
  BookOpen
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { AirQualityMap } from '@/components/air-quality-map'
import { Badge } from '@/components/ui/badge'

interface Station {
  uid: number
  name: string
  lat: number
  lon: number
  aqi: number
  time: string
}

interface SearchResult {
  uid: number
  aqi: string
  time: {
    stime: string
  }
  station: {
    name: string
    geo: [number, number]
  }
}

export default function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [currentAQI, setCurrentAQI] = useState<number | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isUserLocation, setIsUserLocation] = useState(true)

  // Search handler
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(query)}`)
      const result = await response.json()
      
      if (result.data) {
        setSearchResults(result.data)
        setShowSearchResults(true)
      }
    } catch (err) {
      console.error('[v0] Search error:', err)
    } finally {
      setSearching(false)
    }
  }

  const selectSearchResult = (result: SearchResult) => {
    setIsUserLocation(false)
    setShowSearchResults(false)
    setSearchQuery(result.station.name)
    setLocation({ lat: result.station.geo[0], lon: result.station.geo[1] })
  }

  const resetToUserLocation = () => {
    setIsUserLocation(true)
    setSearchQuery('')
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
        },
        () => {
          setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
        }
      )
    }
  }

  useEffect(() => {
    // Get user's geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
        },
        (error) => {
          console.error('[v0] Geolocation error:', error)
          // Fallback to Mumbai coordinates
          setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
        }
      )
    } else {
      setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
    }
  }, [])

  useEffect(() => {
    if (!location) return

    const fetchStations = async () => {
      setLoading(true)
      try {
        // Fetch current location AQI
        const currentResponse = await fetch(
          `/api/aqi?lat=${location.lat}&lon=${location.lon}`
        )
        if (currentResponse.ok) {
          const currentData = await currentResponse.json()
          setCurrentAQI(currentData.data?.aqi || null)
        }

        // Fetch nearby stations
        const stationsResponse = await fetch(
          `/api/stations?lat=${location.lat}&lon=${location.lon}`
        )
        if (stationsResponse.ok) {
          const stationsData = await stationsResponse.json()
          setStations(stationsData.stations || [])
        }
      } catch (error) {
        console.error('[v0] Error fetching stations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
    // Refresh every 5 minutes
    const interval = setInterval(fetchStations, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-chart-4 text-white'
    if (aqi <= 100) return 'bg-chart-2 text-white'
    if (aqi <= 150) return 'bg-accent text-white'
    if (aqi <= 200) return 'bg-destructive text-white'
    return 'bg-destructive text-white'
  }

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy'
    if (aqi <= 200) return 'Very Unhealthy'
    return 'Hazardous'
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Wind className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">AeroGuard</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50"
              >
                <Activity className="w-5 h-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/map">
              <Button 
                variant="default" 
                className="w-full justify-start gap-3 rounded-xl"
              >
                <MapIcon className="w-5 h-5" />
                Map View
              </Button>
            </Link>
            <Link href="/forecast">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50"
              >
                <TrendingUp className="w-5 h-5" />
                Forecast
              </Button>
            </Link>
            <Link href="/health-risk">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50"
              >
                <AlertCircle className="w-5 h-5" />
                Health Risk
              </Button>
            </Link>
            <Link href="/education">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50"
              >
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Learn About AQI
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </Link>
          </nav>
          
          {/* Theme Toggle */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          {/* Current Location Card */}
          <div className="p-4 border-t border-border">
            <Card className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Your Location</span>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-bold">{currentAQI || 'N/A'}</span>
                      {currentAQI && (
                        <Badge className={`${getAQIColor(currentAQI)} rounded-lg mb-1`}>
                          {getAQIStatus(currentAQI)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {location ? `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°` : 'Unknown'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Search Bar - Desktop */}
        <div className="absolute top-4 left-4 right-4 z-10 hidden lg:block">
          <Card className="rounded-2xl shadow-xl border-border/50 bg-background/95 backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for a city or location..."
                    className="pl-10 rounded-xl border-border"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleSearch(e.target.value)
                    }}
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                  )}
                  
                  {/* Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute w-full mt-2 rounded-xl border border-border bg-card shadow-lg max-h-[300px] overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.uid}
                          onClick={() => selectSearchResult(result)}
                          className="w-full p-3 text-left hover:bg-accent/50 transition-colors border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{result.station.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {result.station.geo[0].toFixed(4)}, {result.station.geo[1].toFixed(4)}
                              </p>
                            </div>
                            <Badge className={`${getAQIColor(Number.parseInt(result.aqi))} rounded-lg`}>
                              {result.aqi}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {!isUserLocation && (
                  <Button
                    onClick={resetToUserLocation}
                    variant="outline"
                    className="gap-2 rounded-xl bg-transparent"
                  >
                    <Navigation className="w-4 h-4" />
                    My Location
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-border lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Map View</h1>
            <ThemeToggle />
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-20 lg:top-6 left-4 right-4 lg:left-6 lg:right-auto lg:w-96 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-card/95 backdrop-blur-lg border-border shadow-lg"
            />
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-4 z-10">
          <Card className="rounded-xl bg-card/95 backdrop-blur-lg border-border shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">AQI Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-chart-4" />
                  <span className="text-xs">Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-chart-2" />
                  <span className="text-xs">Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                  <span className="text-xs">Unhealthy (101-150)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive" />
                  <span className="text-xs">Very Unhealthy (151+)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card Overlay */}
        <div className="absolute bottom-6 right-4 z-10 max-w-sm">
          <Card className="rounded-xl bg-card/95 backdrop-blur-lg border-border shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-primary" />
                Map Usage
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>{'• Click markers for detailed AQI info'}</li>
                <li>{'• Zoom in/out to see more stations'}</li>
                <li>{'• Search for any location above'}</li>
                <li>{'• Real-time data updates every 5min'}</li>
              </ul>
              {loading && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin text-primary mx-auto" />
                  <span>Loading nearby stations...</span>
                </div>
              )}
              {!loading && stations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium">
                    Monitoring {stations.length} nearby station{stations.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map Component */}
        <div className="h-screen w-full">
          {location ? (
            <AirQualityMap 
              stations={stations} 
              center={[location.lat, location.lon]}
              zoom={12}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Getting your location...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
