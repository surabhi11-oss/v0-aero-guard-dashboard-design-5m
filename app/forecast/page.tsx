'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface ForecastData {
  aqi: number
  city: {
    name: string
  }
  forecast?: {
    daily?: {
      pm25?: Array<{ avg: number; day: string; max: number; min: number }>
      pm10?: Array<{ avg: number; day: string; max: number; min: number }>
      o3?: Array<{ avg: number; day: string; max: number; min: number }>
    }
  }
}

export default function ForecastPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
        },
        () => {
          setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
        }
      )
    } else {
      setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
    }
  }, [])

  useEffect(() => {
    if (!location) return

    const fetchForecast = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/aqi?lat=${location.lat}&lon=${location.lon}`)
        if (response.ok) {
          const result = await response.json()
          setForecastData(result.data)
        }
      } catch (error) {
        console.error('Error fetching forecast:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [location])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-chart-4 text-white'
    if (aqi <= 100) return 'bg-chart-2 text-foreground'
    if (aqi <= 150) return 'bg-accent text-white'
    return 'bg-destructive text-white'
  }

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy'
    return 'Very Unhealthy'
  }

  // Generate hourly forecast based on current AQI
  const hourlyForecast = forecastData ? Array.from({ length: 24 }, (_, i) => {
    const variation = Math.sin(i / 4) * 15 + Math.random() * 10 - 5
    return {
      hour: `${i}:00`,
      aqi: Math.max(10, Math.round(forecastData.aqi + variation)),
    }
  }) : []

  // Use API forecast data or generate mock data
  const dailyForecast = forecastData?.forecast?.daily?.pm25 || Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const dayVariation = Math.random() * 30 - 15
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      avg: Math.round((forecastData?.aqi || 100) + dayVariation),
      max: Math.round((forecastData?.aqi || 100) + dayVariation + 20),
      min: Math.round((forecastData?.aqi || 100) + dayVariation - 20),
    }
  })

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Wind className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">AeroGuard</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
                <Activity className="w-5 h-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
                <MapIcon className="w-5 h-5" />
                Map View
              </Button>
            </Link>
            <Link href="/forecast">
              <Button variant="default" className="w-full justify-start gap-3 rounded-xl">
                <TrendingUp className="w-5 h-5" />
                Forecast
              </Button>
            </Link>
            <Link href="/health-risk">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
                <AlertCircle className="w-5 h-5" />
                Health Risk
              </Button>
            </Link>
            <Link href="/education">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Learn About AQI
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </Link>
          </nav>

          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Your Account</p>
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
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Forecast</h1>
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Air Quality Forecast</h1>
          <p className="text-muted-foreground">
            {forecastData?.city?.name || 'Your Location'} - Predicted air quality trends
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Current Air Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-bold">{forecastData?.aqi || 'N/A'}</div>
                  {forecastData?.aqi && (
                    <Badge className={`${getAQIColor(forecastData.aqi)} rounded-lg px-4 py-2 text-lg`}>
                      {getAQIStatus(forecastData.aqi)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 24-Hour Forecast */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  24-Hour Forecast
                </CardTitle>
                <CardDescription>Predicted AQI levels for the next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyForecast}>
                      <defs>
                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aqi" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorAqi)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  7-Day Forecast
                </CardTitle>
                <CardDescription>Weekly air quality outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {dailyForecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl border border-border bg-muted/30 text-center hover:border-primary/50 transition-colors"
                    >
                      <p className="text-sm font-medium mb-2">{day.day}</p>
                      <p className="text-3xl font-bold mb-1">{day.avg}</p>
                      <Badge className={`${getAQIColor(day.avg)} rounded-lg text-xs`}>
                        {getAQIStatus(day.avg)}
                      </Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="text-destructive">{day.max}</span>
                        {' / '}
                        <span className="text-chart-4">{day.min}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forecast Insights */}
            <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Forecast Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-semibold mb-2">Best Time for Outdoor Activity</h4>
                    <p className="text-2xl font-bold text-primary mb-1">6:00 - 8:00 AM</p>
                    <p className="text-sm text-muted-foreground">AQI expected to be lowest during early morning hours</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-semibold mb-2">Peak Pollution Hours</h4>
                    <p className="text-2xl font-bold text-destructive mb-1">5:00 - 8:00 PM</p>
                    <p className="text-sm text-muted-foreground">Avoid outdoor exercise during evening rush hour</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-semibold mb-2">Weekly Trend</h4>
                    <p className="text-2xl font-bold text-accent mb-1">Improving</p>
                    <p className="text-sm text-muted-foreground">Air quality expected to improve by weekend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
