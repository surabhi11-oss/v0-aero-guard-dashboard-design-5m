'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  User, 
  Wind, 
  Bell, 
  Map, 
  TrendingUp, 
  Heart, 
  ArrowRight,
  Check,
  ChevronRight
} from 'lucide-react'

type Persona = 'general' | 'children' | 'elderly' | 'outdoor-worker'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [locationGranted, setLocationGranted] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<Persona>('general')

  const totalSteps = 4

  const requestLocation = async () => {
    try {
      const permission = await navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true)
          setTimeout(() => setCurrentStep(2), 500)
        },
        (error) => {
          console.error('[v0] Location permission denied:', error)
          alert('Location access is required for accurate air quality data. Please enable location permissions.')
        }
      )
    } catch (error) {
      console.error('[v0] Geolocation error:', error)
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.setItem('health_persona', selectedPersona)
    router.push('/dashboard')
  }

  const personas = [
    {
      id: 'general' as Persona,
      icon: User,
      title: 'General Public',
      description: 'Standard health monitoring for everyday activities'
    },
    {
      id: 'children' as Persona,
      icon: Heart,
      title: 'Children',
      description: 'Enhanced protection for developing lungs'
    },
    {
      id: 'elderly' as Persona,
      icon: User,
      title: 'Elderly',
      description: 'Sensitive monitoring for respiratory conditions'
    },
    {
      id: 'outdoor-worker' as Persona,
      icon: Wind,
      title: 'Outdoor Worker',
      description: 'Extended exposure risk assessment'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    idx < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : idx === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      idx < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <Card className="rounded-2xl shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-balance">Welcome to AeroGuard</CardTitle>
              <CardDescription className="text-base mt-2">
                Your personal air quality companion for healthier living
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hyperlocal Monitoring</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get real-time air quality data from monitoring stations near your exact location
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">6-Hour Forecasts</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Plan your day with accurate pollution forecasts and trend predictions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-chart-4/5 border border-chart-4/20">
                  <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Health Advice</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Receive tailored recommendations based on your health profile and risk factors
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentStep(1)} 
                className="w-full h-12 text-base rounded-xl"
                size="lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {'Setup takes less than 1 minute • No account required'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Location Permission */}
        {currentStep === 1 && (
          <Card className="rounded-2xl shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-4 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-balance">Enable Location Access</CardTitle>
              <CardDescription className="text-base mt-2">
                We need your location to provide accurate air quality data for your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-muted/50 border border-border/50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Why we need this
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Find the nearest air quality monitoring stations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Provide hyperlocal pollution data specific to your neighborhood</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Send timely alerts when air quality deteriorates in your area</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(0)} 
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button 
                  onClick={requestLocation} 
                  className="flex-1 h-12 rounded-xl"
                  disabled={locationGranted}
                >
                  {locationGranted ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Location Enabled
                    </>
                  ) : (
                    <>
                      Enable Location
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                {'Your location data is never stored or shared • Privacy-first design'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Health Profile */}
        {currentStep === 2 && (
          <Card className="rounded-2xl shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-balance">Select Your Health Profile</CardTitle>
              <CardDescription className="text-base mt-2">
                This helps us provide personalized health advice and risk assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {personas.map((persona) => {
                  const Icon = persona.icon
                  const isSelected = selectedPersona === persona.id
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{persona.title}</h4>
                            {isSelected && (
                              <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {persona.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)} 
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  className="flex-1 h-12 rounded-xl"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Ready to Go */}
        {currentStep === 3 && (
          <Card className="rounded-2xl shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-4 to-primary mx-auto mb-4 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-balance">{'You\'re All Set!'}</CardTitle>
              <CardDescription className="text-base mt-2">
                Your personalized air quality dashboard is ready
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Location Enabled</p>
                    <p className="text-sm text-muted-foreground">Real-time monitoring active</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Health Profile Set</p>
                    <p className="text-sm text-muted-foreground">
                      {personas.find(p => p.id === selectedPersona)?.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Alerts Configured</p>
                    <p className="text-sm text-muted-foreground">Get notified of air quality changes</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-chart-4/10 border border-border/50">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {'We\'ll start monitoring air quality in your area and provide real-time updates, forecasts, and personalized health recommendations based on your profile.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-lg">Live AQI Updates</Badge>
                  <Badge variant="secondary" className="rounded-lg">6-Hour Forecasts</Badge>
                  <Badge variant="secondary" className="rounded-lg">Health Insights</Badge>
                </div>
              </div>

              <Button 
                onClick={completeOnboarding} 
                className="w-full h-12 text-base rounded-xl"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
