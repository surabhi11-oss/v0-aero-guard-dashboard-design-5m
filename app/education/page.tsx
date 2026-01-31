'use client'

import { useState } from 'react'
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
  BookOpen,
  Info,
  Globe,
  Shield,
  Map as MapIcon
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const aqiLevels = [
  { range: '0-50', label: 'Good', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { range: '51-100', label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-400', bgLight: 'bg-yellow-50 dark:bg-yellow-950/30', description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' },
  { range: '101-150', label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-700 dark:text-orange-400', bgLight: 'bg-orange-50 dark:bg-orange-950/30', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
  { range: '151-200', label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-400', bgLight: 'bg-red-50 dark:bg-red-950/30', description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
  { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700 dark:text-purple-400', bgLight: 'bg-purple-50 dark:bg-purple-950/30', description: 'Health alert: The risk of health effects is increased for everyone.' },
  { range: '300+', label: 'Hazardous', color: 'bg-rose-800', textColor: 'text-rose-700 dark:text-rose-400', bgLight: 'bg-rose-50 dark:bg-rose-950/30', description: 'Health warning of emergency conditions: everyone is more likely to be affected.' },
]

const pollutants = [
  { name: 'PM2.5', fullName: 'Fine Particulate Matter', whoGuideline: '15 µg/m³ (24-hour)', description: 'Tiny particles less than 2.5 micrometers in diameter that can penetrate deep into the lungs and enter the bloodstream. Major sources include vehicle emissions, industrial processes, and wildfires.' },
  { name: 'PM10', fullName: 'Coarse Particulate Matter', whoGuideline: '45 µg/m³ (24-hour)', description: 'Particles between 2.5 and 10 micrometers. Sources include dust from roads, construction sites, and agricultural operations.' },
  { name: 'O3', fullName: 'Ozone', whoGuideline: '100 µg/m³ (8-hour)', description: 'Ground-level ozone is created by chemical reactions between oxides of nitrogen and volatile organic compounds in sunlight. Can trigger asthma and reduce lung function.' },
  { name: 'NO2', fullName: 'Nitrogen Dioxide', whoGuideline: '25 µg/m³ (24-hour)', description: 'Primarily from burning fuel in vehicles and power plants. Can irritate airways and aggravate respiratory diseases.' },
  { name: 'SO2', fullName: 'Sulfur Dioxide', whoGuideline: '40 µg/m³ (24-hour)', description: 'Produced from burning fossil fuels containing sulfur. Can cause breathing difficulties and worsen asthma.' },
  { name: 'CO', fullName: 'Carbon Monoxide', whoGuideline: '4 mg/m³ (24-hour)', description: 'Colorless, odorless gas from incomplete combustion. Reduces oxygen delivery to body organs and tissues.' },
]

export default function EducationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-card via-card to-primary/5 border-r border-primary/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-lg">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">AeroGuard</span>
            </Link>
          </div>
          
          {/* Close button on mobile */}
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-4/10 transition-all"
              >
                <Activity className="w-5 h-5 text-primary" />
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
                className="w-full justify-start gap-3 rounded-xl bg-gradient-to-r from-primary to-chart-4 text-white shadow-md hover:shadow-lg transition-all"
              >
                <BookOpen className="w-5 h-5" />
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
                <p className="text-xs text-muted-foreground truncate">Learning Mode</p>
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
          <h1 className="text-xl font-bold">Learn About AQI</h1>
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Air Quality Education</h1>
              <p className="text-muted-foreground">Understanding AQI and WHO Guidelines</p>
            </div>
          </div>
        </div>

        {/* What is AQI Section */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              What is the Air Quality Index (AQI)?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The Air Quality Index (AQI) is a standardized indicator developed by environmental agencies to communicate how polluted the air is or how polluted it is forecast to become. It transforms complex air quality data into a simple number and color code that helps people understand when to take action to protect their health.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The AQI is calculated based on five major pollutants: ground-level ozone (O3), particulate matter (PM2.5 and PM10), carbon monoxide (CO), sulfur dioxide (SO2), and nitrogen dioxide (NO2). The AQI value is determined by the pollutant with the highest concentration at any given time.
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-chart-4/10 border border-primary/20">
              <p className="text-sm font-medium text-foreground">
                Think of AQI like a thermometer for air pollution - the higher the number, the greater the health concern.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AQI Scale Section */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-chart-4" />
              AQI Scale and Health Categories
            </CardTitle>
            <CardDescription>Understanding what the numbers mean for your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aqiLevels.map((level) => (
                <div key={level.range} className={`p-4 rounded-xl ${level.bgLight} border border-border/50`}>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-4 h-4 rounded-full ${level.color}`} />
                    <span className="font-mono font-bold text-foreground">{level.range}</span>
                    <span className={`font-semibold ${level.textColor}`}>{level.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">{level.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* WHO Guidelines Section */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-chart-5" />
              WHO Air Quality Guidelines (2021)
            </CardTitle>
            <CardDescription>World Health Organization recommended exposure limits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The World Health Organization (WHO) updated its global air quality guidelines in 2021 for the first time since 2005. These guidelines provide recommended limits for key air pollutants that pose health risks. The new guidelines are significantly stricter, reflecting the growing evidence of health impacts at lower pollution levels.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {pollutants.map((pollutant) => (
                <div key={pollutant.name} className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-foreground">{pollutant.name}</span>
                    <span className="text-xs font-mono px-2 py-1 rounded-lg bg-primary/10 text-primary">{pollutant.whoGuideline}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{pollutant.fullName}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pollutant.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Protection Tips */}
        <Card className="rounded-2xl shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Protecting Your Health
            </CardTitle>
            <CardDescription>Actions you can take based on AQI levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">When AQI is Good (0-50)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Enjoy outdoor activities freely</li>
                  <li>Open windows for fresh air</li>
                  <li>Great time for exercise outdoors</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200/50 dark:border-yellow-800/50">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">When AQI is Moderate (51-100)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Sensitive individuals should limit prolonged outdoor exertion</li>
                  <li>Consider indoor activities if you have respiratory issues</li>
                  <li>Watch for symptoms like coughing or shortness of breath</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/50">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">When AQI is Unhealthy (101-150)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Reduce prolonged outdoor activities</li>
                  <li>Keep windows closed</li>
                  <li>Use air purifiers indoors if available</li>
                  <li>Wear N95 masks if going outside</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">When AQI is Very Unhealthy (150+)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Avoid all outdoor activities</li>
                  <li>Keep all windows and doors closed</li>
                  <li>Run air purifiers continuously</li>
                  <li>Seek medical attention if experiencing symptoms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensitive Groups */}
        <Card className="rounded-2xl shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Sensitive Groups
            </CardTitle>
            <CardDescription>Who needs to be extra careful about air quality?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👶</span>
                </div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Children</h4>
                <p className="text-xs text-muted-foreground mt-1">Developing lungs are more vulnerable to pollution</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/50 text-center">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👴</span>
                </div>
                <h4 className="font-semibold text-violet-700 dark:text-violet-400">Elderly</h4>
                <p className="text-xs text-muted-foreground mt-1">Higher risk of cardiovascular and respiratory effects</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/50 dark:border-rose-800/50 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🫁</span>
                </div>
                <h4 className="font-semibold text-rose-700 dark:text-rose-400">Respiratory Conditions</h4>
                <p className="text-xs text-muted-foreground mt-1">Asthma, COPD, and other lung diseases</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏃</span>
                </div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">Outdoor Workers</h4>
                <p className="text-xs text-muted-foreground mt-1">Extended exposure increases health risks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
