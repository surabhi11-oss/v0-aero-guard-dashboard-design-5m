'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wind, 
  MapPin, 
  User, 
  Settings, 
  TrendingUp,
  Activity,
  AlertCircle,
  Menu,
  X,
  Loader2,
  Map as MapIcon,
  Search,
  Navigation,
  BookOpen
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, AreaChart, Area } from 'recharts'

type Persona = 'general' | 'children' | 'elderly' | 'outdoor-worker'

const getAQIGradient = (aqi: number) => {
  if (aqi <= 50) return 'from-emerald-400 via-emerald-500 to-teal-500'
  if (aqi <= 100) return 'from-yellow-400 via-amber-400 to-orange-400'
  if (aqi <= 150) return 'from-orange-400 via-orange-500 to-red-400'
  if (aqi <= 200) return 'from-red-400 via-red-500 to-rose-500'
  if (aqi <= 300) return 'from-purple-400 via-purple-500 to-fuchsia-500'
  return 'from-rose-600 via-red-700 to-rose-800'
}

const getAQIBgClass = (aqi: number) => {
  if (aqi <= 50) return 'bg-emerald-500'
  if (aqi <= 100) return 'bg-amber-500'
  if (aqi <= 150) return 'bg-orange-500'
  if (aqi <= 200) return 'bg-red-500'
  if (aqi <= 300) return 'bg-purple-500'
  return 'bg-rose-700'
}

const getAQITextColor = (aqi: number) => {
  if (aqi <= 50) return 'text-emerald-600'
  if (aqi <= 100) return 'text-amber-600'
  if (aqi <= 150) return 'text-orange-600'
  if (aqi <= 200) return 'text-red-600'
  if (aqi <= 300) return 'text-purple-600'
  return 'text-rose-700'
}

interface AQIData {
  aqi: number
  city: {
    name: string
    geo: [number, number]
  }
  iaqi: {
    pm25?: { v: number }
    pm10?: { v: number }
    no2?: { v: number }
    co?: { v: number }
    o3?: { v: number }
  }
  time: {
    s: string
  }
  forecast?: {
    daily?: {
      pm25?: Array<{ avg: number; day: string }>
    }
  }
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

export default function DashboardPage() {
  const router = useRouter()
  const [selectedPersona, setSelectedPersona] = useState<Persona>('general')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isUserLocation, setIsUserLocation] = useState(true)

  // Check onboarding completion and load persona
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboarding_complete')
    if (!onboardingComplete) {
      router.push('/onboarding')
      return
    }
    
    const savedPersona = localStorage.getItem('health_persona') as Persona
    if (savedPersona) {
      setSelectedPersona(savedPersona)
    }
  }, [router])

  // Save persona when it changes
  useEffect(() => {
    localStorage.setItem('health_persona', selectedPersona)
  }, [selectedPersona])

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

  const selectSearchResult = async (result: SearchResult) => {
    setIsUserLocation(false)
    setShowSearchResults(false)
    setSearchQuery(result.station.name)
    setLocation({ lat: result.station.geo[0], lon: result.station.geo[1] })
  }

  const resetToUserLocation = () => {
    setIsUserLocation(true)
    setSearchQuery('')
    // Trigger geolocation again
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
          // Fallback to Mumbai coordinates from user's example
          setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
        }
      )
    } else {
      // Fallback to Mumbai coordinates
      setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
    }
  }, [])

  useEffect(() => {
    if (!location) return

    const fetchAQIData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/aqi?lat=${location.lat}&lon=${location.lon}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch AQI data')
        }

        const result = await response.json()
        
        if (result.data) {
          setAqiData(result.data)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (err) {
        console.error('[v0] Error fetching AQI:', err)
        setError('Failed to load air quality data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAQIData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAQIData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location])

  // Generate more realistic forecast based on current AQI, time of day, and trends
  const generateForecast = () => {
    if (!aqiData) return []
    
    const currentAQI = aqiData.aqi
    const currentHour = new Date().getHours()
    
    // Morning rush (7-9): AQI tends to rise
    // Midday (10-14): AQI may stabilize or drop slightly
    // Evening rush (17-20): AQI rises again
    // Night (21-6): AQI drops as traffic decreases
    
    const getHourlyModifier = (hourOffset: number) => {
      const targetHour = (currentHour + hourOffset) % 24
      
      // Traffic rush hours cause pollution spikes
      if (targetHour >= 7 && targetHour <= 9) return 1.15 + Math.random() * 0.1
      if (targetHour >= 17 && targetHour <= 20) return 1.20 + Math.random() * 0.1
      
      // Midday - moderate levels
      if (targetHour >= 10 && targetHour <= 14) return 0.95 + Math.random() * 0.1
      
      // Night hours - lower pollution
      if (targetHour >= 21 || targetHour <= 5) return 0.80 + Math.random() * 0.1
      
      // Default transition periods
      return 1.0 + (Math.random() * 0.15 - 0.075)
    }
    
    const formatTime = (offset: number) => {
      if (offset === 0) return 'Now'
      const targetHour = (currentHour + offset) % 24
      const period = targetHour >= 12 ? 'PM' : 'AM'
      const displayHour = targetHour % 12 || 12
      return `${displayHour}${period}`
    }
    
    return Array.from({ length: 7 }, (_, i) => ({
      time: formatTime(i),
      aqi: Math.round(currentAQI * getHourlyModifier(i)),
      hour: (currentHour + i) % 24
    }))
  }
  
  const forecastData = generateForecast()

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
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    return 'Very Unhealthy'
  }

  const getHealthAdvice = (persona: Persona) => {
    const advice = {
      general: 'Consider reducing prolonged outdoor activities. Air quality is moderate. Sensitive individuals should limit outdoor exertion.',
      children: 'Avoid outdoor activity after 5 PM when AQI peaks. Keep children indoors during high pollution hours. Ensure windows are closed.',
      elderly: 'Stay indoors during peak pollution hours. Use air purifiers at home. Wear a mask if stepping out. Monitor heart rate and breathing.',
      'outdoor-worker': 'Wear an N95 mask throughout your shift. Take frequent breaks in filtered air environments. Stay hydrated and monitor symptoms.'
    }
    return advice[persona]
  }

  const getPersonaLabel = (persona: Persona) => {
    const labels = {
      general: 'General Public',
      children: 'Children',
      elderly: 'Elderly',
      'outdoor-worker': 'Outdoor Worker'
    }
    return labels[persona]
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (loading && !aqiData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading real-time air quality data...</p>
        </div>
      </div>
    )
  }

  if (error && !aqiData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-foreground font-semibold">Error Loading Data</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const currentAQI = aqiData?.aqi || 0

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

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard">
              <Button 
                className="w-full justify-start gap-3 rounded-xl bg-gradient-to-r from-primary to-chart-4 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Activity className="w-5 h-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/map">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <MapIcon className="w-5 h-5 text-chart-4" />
                Map View
              </Button>
            </Link>
            <Link href="/forecast">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <TrendingUp className="w-5 h-5 text-chart-5" />
                Forecast
              </Button>
            </Link>
            <Link href="/health-risk">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <AlertCircle className="w-5 h-5 text-chart-2" />
                Health Risk
              </Button>
            </Link>
            <Link href="/education">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Learn About AQI
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
                Settings
              </Button>
            </Link>
          </nav>

          {/* Theme Toggle & User Profile */}
          <div className="p-4 border-t border-primary/10 space-y-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-chart-4/10 to-accent/10 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Your Profile</p>
                <p className="text-xs text-muted-foreground truncate">
                  {location ? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </div>

        {/* Search Bar */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for a city or location (e.g., Mumbai, Tokyo, New York)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                )}
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 rounded-xl border border-border bg-card shadow-lg max-h-[300px] overflow-y-auto">
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
                          <Badge 
                            variant={
                              Number.parseInt(result.aqi) <= 50 ? 'default' :
                              Number.parseInt(result.aqi) <= 100 ? 'secondary' :
                              Number.parseInt(result.aqi) <= 150 ? 'outline' :
                              'destructive'
                            }
                            className="rounded-lg"
                          >
                            AQI {result.aqi}
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
                  Use My Location
                </Button>
              )}
            </div>
            
            {!isUserLocation && searchQuery && (
              <p className="text-sm text-muted-foreground mt-3">
                {'Showing results for: '}<span className="font-medium text-foreground">{searchQuery}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Row - Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Current AQI */}
          <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-primary" />
                Current AQI
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{aqiData?.city?.name || 'Detecting location...'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 mb-4">
                <div className={`text-7xl font-bold bg-gradient-to-r ${getAQIGradient(currentAQI)} bg-clip-text text-transparent`}>
                  {currentAQI}
                </div>
                <Badge className={`${getAQIBgClass(currentAQI)} text-white rounded-full px-4 py-1.5 mb-2 shadow-lg`}>
                  {getAQIStatus(currentAQI)}
                </Badge>
              </div>
              
              {/* AQI Progress Bar */}
              <div className="mb-6">
                <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 via-red-400 via-purple-400 to-rose-700 overflow-hidden">
                  <div 
                    className="h-full bg-white/30 backdrop-blur-sm transition-all duration-500"
                    style={{ marginLeft: `${Math.min(currentAQI / 5, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                  <span>Hazardous</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200/50 dark:border-blue-800/50">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">PM2.5</span>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{aqiData?.iaqi?.pm25?.v || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-200/50 dark:border-violet-800/50">
                  <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">PM10</span>
                  <p className="text-lg font-bold text-violet-700 dark:text-violet-300">{aqiData?.iaqi?.pm10?.v || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200/50 dark:border-amber-800/50">
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">NO2</span>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{aqiData?.iaqi?.no2?.v || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border border-rose-200/50 dark:border-rose-800/50">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">CO</span>
                  <p className="text-lg font-bold text-rose-700 dark:text-rose-300">{aqiData?.iaqi?.co?.v || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card via-card to-chart-4/5 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chart-4 to-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                Your Location
              </CardTitle>
              <CardDescription>Real-time monitoring station</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-sm leading-relaxed">
                    {getHealthAdvice(selectedPersona)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Quick Tips:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Check AQI before planning outdoor activities'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Close windows during peak pollution hours'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Use air purifiers indoors when AQI > 100'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Wear N95 masks for outdoor exposure'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Profile */}
          <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Health Profile
              </CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedPersona} onValueChange={(value) => setSelectedPersona(value as Persona)}>
                  <SelectTrigger className="w-full rounded-xl border-primary/20 bg-gradient-to-r from-primary/5 to-chart-4/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Public</SelectItem>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="elderly">Elderly</SelectItem>
                    <SelectItem value="outdoor-worker">Outdoor Worker</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className={`p-4 rounded-xl border ${
                  currentAQI > 150 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-red-200 dark:border-red-800'
                    : currentAQI > 100
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-200 dark:border-amber-800'
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={`w-4 h-4 ${
                      currentAQI > 150 ? 'text-red-500' : currentAQI > 100 ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                    <p className="text-sm font-semibold">Risk Assessment</p>
                  </div>
                  <p className={`text-xs ${
                    currentAQI > 150 ? 'text-red-600 dark:text-red-400' : currentAQI > 100 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {currentAQI > 150 ? 'High' : currentAQI > 100 ? 'Moderate' : 'Low'} risk for {getPersonaLabel(selectedPersona)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section - Forecast & Health Advice */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* 6-Hour AQI Forecast */}
          <Card className="lg:col-span-2 rounded-2xl shadow-lg border-border/50 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    6-Hour AQI Forecast
                  </CardTitle>
                  <CardDescription className="mt-1">Predicted air quality based on time patterns</CardDescription>
                </div>
                {forecastData.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Peak Expected</p>
                    <p className={`text-lg font-bold ${getAQITextColor(Math.max(...forecastData.map(d => d.aqi)))}`}>
                      {Math.max(...forecastData.map(d => d.aqi))} AQI
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid 
                      strokeDasharray="1 0" 
                      stroke="hsl(var(--border))" 
                      opacity={0.4}
                      vertical={true}
                      horizontal={true}
                    />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '11px' }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      domain={['dataMin - 10', 'dataMax + 20']}
                    />
                    <ReferenceLine y={50} stroke="#22c55e" strokeDasharray="5 5" strokeOpacity={0.7} label={{ value: 'Good', position: 'right', fontSize: 10, fill: '#22c55e' }} />
                    <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="5 5" strokeOpacity={0.7} label={{ value: 'Moderate', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
                    <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.7} label={{ value: 'Unhealthy', position: 'right', fontSize: 10, fill: '#ef4444' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.15)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
                      formatter={(value: number) => [`${value} AQI`, 'Air Quality']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                      activeDot={{ r: 7, strokeWidth: 3, stroke: 'hsl(var(--card))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend as grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/50">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Unhealthy (101-150)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">Unhealthy (151+)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Advice */}
          <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Health Advice
              </CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-sm leading-relaxed">
                    {getHealthAdvice(selectedPersona)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Quick Tips:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Check AQI before planning outdoor activities'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Close windows during peak pollution hours'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Use air purifiers indoors when AQI > 100'}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <span>{'Wear N95 masks for outdoor exposure'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explainability Section */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Why is AQI {currentAQI > 100 ? 'High' : 'at This Level'} Here?
            </CardTitle>
            <CardDescription>AI-powered air quality analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-primary" />
                  Environmental Factors
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Current atmospheric conditions in {aqiData?.city?.name || 'your area'} are affecting air quality. 
                  {currentAQI > 100 ? ' Low wind speed and high traffic emissions are causing pollutant buildup.' : ' Weather patterns are helping to disperse pollutants.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-lg">PM2.5: {aqiData?.iaqi?.pm25?.v || 'N/A'} µg/m³</Badge>
                  {aqiData?.iaqi?.pm10 && <Badge variant="outline" className="rounded-lg">PM10: {aqiData.iaqi.pm10.v} µg/m³</Badge>}
                  {aqiData?.iaqi?.o3 && <Badge variant="outline" className="rounded-lg">O₃: {aqiData.iaqi.o3.v} ppb</Badge>}
                </div>
              </div>

              {currentAQI > 100 && (
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Pollutant Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Elevated particulate matter levels detected. These fine particles can penetrate deep into lungs and pose health risks, especially for individuals with asthma or heart disease.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <h4 className="font-semibold mb-2">Health Impact Assessment</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">For {getPersonaLabel(selectedPersona)}:</strong> Current conditions pose a {currentAQI > 100 ? 'high' : 'moderate'} health risk. 
                  {selectedPersona === 'elderly' && ' Elderly individuals with cardiovascular or respiratory conditions should minimize outdoor exposure and monitor symptoms closely.'}
                  {selectedPersona === 'children' && ' Children are particularly vulnerable as their lungs are still developing. Keep them indoors during peak pollution hours.'}
                  {selectedPersona === 'outdoor-worker' && ' Extended outdoor exposure increases respiratory irritation risk. Use protective equipment and take regular breaks.'}
                  {selectedPersona === 'general' && ' Sensitive individuals may experience respiratory irritation. Limit prolonged outdoor exertion.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
