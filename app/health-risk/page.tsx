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
  Heart,
  Shield,
  AlertTriangle,
  Baby,
  PersonStanding,
  BookOpen
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Persona = 'general' | 'children' | 'elderly' | 'outdoor-worker'

export default function HealthRiskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentAQI, setCurrentAQI] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<Persona>('general')

  useEffect(() => {
    const savedPersona = localStorage.getItem('health_persona') as Persona
    if (savedPersona) setSelectedPersona(savedPersona)

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

    const fetchAQI = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/aqi?lat=${location.lat}&lon=${location.lon}`)
        if (response.ok) {
          const result = await response.json()
          setCurrentAQI(result.data?.aqi || null)
        }
      } catch (error) {
        console.error('Error fetching AQI:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAQI()
  }, [location])

  const getRiskLevel = (aqi: number, persona: Persona) => {
    const multipliers: Record<Persona, number> = {
      general: 1,
      children: 1.3,
      elderly: 1.4,
      'outdoor-worker': 1.2
    }
    const adjustedAQI = aqi * multipliers[persona]
    
    if (adjustedAQI <= 50) return { level: 'Low', color: 'text-chart-4', bgColor: 'bg-chart-4', percent: 20 }
    if (adjustedAQI <= 100) return { level: 'Moderate', color: 'text-chart-2', bgColor: 'bg-chart-2', percent: 40 }
    if (adjustedAQI <= 150) return { level: 'High', color: 'text-accent', bgColor: 'bg-accent', percent: 60 }
    if (adjustedAQI <= 200) return { level: 'Very High', color: 'text-destructive', bgColor: 'bg-destructive', percent: 80 }
    return { level: 'Severe', color: 'text-destructive', bgColor: 'bg-destructive', percent: 100 }
  }

  const healthImpacts = [
    {
      condition: 'Respiratory Issues',
      description: 'Irritation of airways, coughing, difficulty breathing',
      risk: currentAQI ? getRiskLevel(currentAQI, selectedPersona).percent + 10 : 0,
      icon: Wind
    },
    {
      condition: 'Cardiovascular Stress',
      description: 'Increased heart rate, blood pressure changes',
      risk: currentAQI ? getRiskLevel(currentAQI, selectedPersona).percent : 0,
      icon: Heart
    },
    {
      condition: 'Eye Irritation',
      description: 'Burning, watering, redness of eyes',
      risk: currentAQI ? Math.min(100, getRiskLevel(currentAQI, selectedPersona).percent + 15) : 0,
      icon: AlertCircle
    },
    {
      condition: 'Fatigue & Headache',
      description: 'General discomfort, reduced concentration',
      risk: currentAQI ? getRiskLevel(currentAQI, selectedPersona).percent - 10 : 0,
      icon: Activity
    }
  ]

  const personaRecommendations: Record<Persona, { title: string; icon: any; tips: string[] }> = {
    general: {
      title: 'General Public',
      icon: PersonStanding,
      tips: [
        'Monitor daily AQI levels before planning outdoor activities',
        'Use air purifiers indoors when AQI exceeds 100',
        'Keep windows closed during high pollution periods',
        'Stay hydrated to help your body process pollutants'
      ]
    },
    children: {
      title: 'Children',
      icon: Baby,
      tips: [
        'Limit outdoor playtime when AQI exceeds 50',
        'Choose morning hours for outdoor activities',
        'Ensure schools have proper air filtration',
        'Teach children to recognize pollution symptoms'
      ]
    },
    elderly: {
      title: 'Elderly',
      icon: User,
      tips: [
        'Avoid outdoor exercise when AQI exceeds 100',
        'Keep heart and respiratory medications accessible',
        'Use N95 masks when going outside',
        'Have emergency contacts readily available'
      ]
    },
    'outdoor-worker': {
      title: 'Outdoor Workers',
      icon: Shield,
      tips: [
        'Always wear N95 or better respirator masks',
        'Take breaks in filtered air environments',
        'Stay hydrated throughout your shift',
        'Report symptoms to supervisor immediately'
      ]
    }
  }

  const currentRisk = currentAQI ? getRiskLevel(currentAQI, selectedPersona) : null

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
              <Button variant="default" className="w-full justify-start gap-3 rounded-xl">
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
          <h1 className="text-xl font-bold">Health Risk</h1>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Health Risk Assessment</h1>
          <p className="text-muted-foreground">Personalized health analysis based on current air quality</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Risk Level */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Current Risk Level
                </CardTitle>
                <CardDescription>Based on AQI {currentAQI} for {personaRecommendations[selectedPersona].title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <div className={`text-5xl font-bold ${currentRisk?.color}`}>
                    {currentRisk?.level || 'N/A'}
                  </div>
                  <Badge className={`${currentRisk?.bgColor} text-white rounded-lg px-4 py-2`}>
                    AQI: {currentAQI}
                  </Badge>
                </div>
                <Progress value={currentRisk?.percent || 0} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Low Risk</span>
                  <span>Severe Risk</span>
                </div>
              </CardContent>
            </Card>

            {/* Persona Selection */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle>Select Health Profile</CardTitle>
                <CardDescription>Choose your profile for personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(Object.keys(personaRecommendations) as Persona[]).map((persona) => {
                    const { title, icon: Icon } = personaRecommendations[persona]
                    return (
                      <button
                        key={persona}
                        onClick={() => {
                          setSelectedPersona(persona)
                          localStorage.setItem('health_persona', persona)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedPersona === persona 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedPersona === persona ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="text-sm font-medium text-center">{title}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Health Impacts */}
            <Card className="rounded-2xl shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Potential Health Impacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthImpacts.map((impact, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <impact.icon className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{impact.condition}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{impact.description}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={Math.max(0, impact.risk)} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{Math.max(0, impact.risk)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Recommendations for {personaRecommendations[selectedPersona].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {personaRecommendations[selectedPersona].tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
