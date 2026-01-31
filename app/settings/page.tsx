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
  Map as MapIcon,
  Bell,
  Globe,
  Shield,
  Trash2,
  RefreshCw,
  BookOpen
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Persona = 'general' | 'children' | 'elderly' | 'outdoor-worker'

export default function SettingsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<Persona>('general')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [refreshInterval, setRefreshInterval] = useState('5')

  useEffect(() => {
    const savedPersona = localStorage.getItem('health_persona') as Persona
    if (savedPersona) setSelectedPersona(savedPersona)

    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) setNotifications(savedNotifications === 'true')

    const savedUnits = localStorage.getItem('units') as 'metric' | 'imperial'
    if (savedUnits) setUnits(savedUnits)

    const savedInterval = localStorage.getItem('refresh_interval')
    if (savedInterval) setRefreshInterval(savedInterval)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
        },
        () => {
          setLocation({ lat: 19.113405637156333, lon: 72.93278607789993 })
        }
      )
    }
  }, [])

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona)
    localStorage.setItem('health_persona', persona)
  }

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled)
    localStorage.setItem('notifications', String(enabled))
  }

  const handleUnitsChange = (unit: 'metric' | 'imperial') => {
    setUnits(unit)
    localStorage.setItem('units', unit)
  }

  const handleRefreshIntervalChange = (interval: string) => {
    setRefreshInterval(interval)
    localStorage.setItem('refresh_interval', interval)
  }

  const handleResetOnboarding = () => {
    localStorage.removeItem('onboarding_complete')
    localStorage.removeItem('health_persona')
    localStorage.removeItem('location_granted')
    router.push('/onboarding')
  }

  const handleClearAllData = () => {
    localStorage.clear()
    router.push('/')
  }

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
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-accent/50">
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
              <Button variant="default" className="w-full justify-start gap-3 rounded-xl">
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
          <h1 className="text-xl font-bold">Settings</h1>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your AeroGuard experience</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Health Profile */}
          <Card className="rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Health Profile
              </CardTitle>
              <CardDescription>Select your health profile for personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPersona} onValueChange={(v) => handlePersonaChange(v as Persona)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Public</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                  <SelectItem value="elderly">Elderly</SelectItem>
                  <SelectItem value="outdoor-worker">Outdoor Worker</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AQI Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when air quality changes significantly</p>
                </div>
                <Switch checked={notifications} onCheckedChange={handleNotificationsChange} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Warnings</p>
                  <p className="text-sm text-muted-foreground">Receive health-related alerts based on your profile</p>
                </div>
                <Switch checked={notifications} onCheckedChange={handleNotificationsChange} />
              </div>
            </CardContent>
          </Card>

          {/* Display */}
          <Card className="rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Units</p>
                  <p className="text-sm text-muted-foreground">Temperature and measurement units</p>
                </div>
                <Select value={units} onValueChange={(v) => handleUnitsChange(v as 'metric' | 'imperial')}>
                  <SelectTrigger className="w-32 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Refresh Interval</p>
                  <p className="text-sm text-muted-foreground">How often to update AQI data</p>
                </div>
                <Select value={refreshInterval} onValueChange={handleRefreshIntervalChange}>
                  <SelectTrigger className="w-32 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </CardTitle>
              <CardDescription>Your current location settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Location</p>
                    <p className="text-sm text-muted-foreground">
                      {location ? `${location.lat.toFixed(6)}°, ${location.lon.toFixed(6)}°` : 'Not available'}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-chart-4 mr-2" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your app data and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-medium">Reset Onboarding</p>
                  <p className="text-sm text-muted-foreground">Go through the setup process again</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={handleResetOnboarding}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/50 bg-destructive/5">
                <div>
                  <p className="font-medium text-destructive">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">Remove all saved preferences and data</p>
                </div>
                <Button variant="destructive" size="sm" className="rounded-xl" onClick={handleClearAllData}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle>About AeroGuard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Version 1.0.0</p>
                <p>Hyperlocal Air Quality and Health Risk Forecaster</p>
                <p className="pt-2">Data provided by World Air Quality Index Project (AQICN)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
