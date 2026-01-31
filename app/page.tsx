import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wind, TrendingUp, HeartPulse, MapPin, Sparkles, Shield, Zap, Globe } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-chart-4">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">AeroGuard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/education" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Learn About AQI
            </Link>
            <Link href="/dashboard" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ThemeToggle />
            <Link href="/onboarding">
              <Button className="rounded-xl bg-gradient-to-r from-primary to-chart-4 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-4/10 to-accent/20 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-chart-4/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="container relative z-10 px-4 py-20 mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-primary/20 to-chart-4/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Real-time AI-powered monitoring</span>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-4 rounded-3xl blur-xl opacity-50" />
              <div className="relative p-5 rounded-3xl bg-gradient-to-br from-primary to-chart-4 shadow-2xl">
                <Wind className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-balance">
            <span className="bg-gradient-to-r from-primary via-chart-4 to-accent bg-clip-text text-transparent">
              AeroGuard
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4 max-w-3xl mx-auto text-balance">
            Hyper-Local Air Quality & Health Risk Forecaster
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Get real-time air quality insights for your exact location, personalized health risk assessments, and predictive forecasts to plan your day safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-chart-4 hover:from-primary/90 hover:to-chart-4/90 text-white font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 bg-transparent">
                View Dashboard
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            {'No signup required • Takes less than 1 minute • 100% Free'}
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">10K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-chart-4 to-accent bg-clip-text text-transparent">50+</p>
              <p className="text-sm text-muted-foreground">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-accent to-chart-3 bg-clip-text text-transparent">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              The Challenge
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why Traditional AQI Apps Fail</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Standard air quality monitoring falls short when it comes to personal health decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="rounded-3xl border-2 border-destructive/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-destructive/5 group hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Not Hyperlocal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {'City-wide averages hide critical street-level variations. Your neighborhood may be drastically different from the city average.'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-amber-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-amber-500/5 group hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">No Health Context</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {'Generic AQI numbers ignore your personal health conditions, age, and risk factors that dramatically change impact.'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-chart-5/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-5/5 group hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-5/20 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-chart-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">No Forecasting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {'Without predictive insights, you can\'t plan ahead for outdoor activities or prepare for incoming pollution spikes.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                Our Solution
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                  Smart Air Quality
                </span>
                <br />Intelligence
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                AeroGuard combines hyperlocal monitoring, predictive AI, and personalized health profiles to deliver actionable air quality intelligence tailored to you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time Updates</h4>
                    <p className="text-sm text-muted-foreground">Data refreshes every 5 minutes from thousands of sensors</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-chart-4/5 to-transparent border border-chart-4/10">
                  <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Health Protection</h4>
                    <p className="text-sm text-muted-foreground">Personalized alerts based on your health profile</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-accent/5 to-transparent border border-accent/10">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Global Coverage</h4>
                    <p className="text-sm text-muted-foreground">Monitor air quality anywhere in the world</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-4/20 rounded-3xl blur-3xl" />
              <Card className="relative rounded-3xl border-2 border-primary/20 shadow-2xl overflow-hidden bg-gradient-to-br from-card via-card to-primary/10">
                <CardContent className="p-8">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center">
                          <Wind className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">AeroGuard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">Live</span>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                      <p className="text-sm text-muted-foreground mb-2">Current AQI</p>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">42</span>
                        <span className="text-lg font-semibold text-emerald-500 mb-1">Good</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-500 font-medium">PM2.5</p>
                        <p className="text-xl font-bold text-blue-600">12</p>
                      </div>
                      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs text-violet-500 font-medium">PM10</p>
                        <p className="text-xl font-bold text-violet-600">28</p>
                      </div>
                    </div>
                    
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 to-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-chart-4/10 text-chart-4 border border-chart-4/20">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent"> Breathe Easy</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Advanced air quality intelligence designed for your health and safety
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="rounded-3xl border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-card to-primary/5 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">Hyperlocal AQI</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Street-level air quality data for your exact location
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-chart-4/20 shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-card to-chart-4/5 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-chart-4/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-4 to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">Smart Forecast</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI-powered 6-hour predictive trends for planning
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-chart-3/20 shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-card to-chart-3/5 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-chart-3/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-3 to-destructive flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">Health Advice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Personalized recommendations for your profile
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-chart-5/20 shadow-xl hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-card to-chart-5/5 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-chart-5/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-5 to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Wind className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">Live Heatmap</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interactive pollution map of your entire city
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why AeroGuard Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Why Choose AeroGuard
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Trusted by Health-Conscious People Worldwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Here is why AeroGuard stands out from other air quality apps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">WHO Standards Based</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our health recommendations follow the latest 2021 WHO Air Quality Guidelines, ensuring you get science-backed advice.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">10,000+ Monitoring Stations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access real-time data from over 10,000 air quality monitoring stations across 100+ countries worldwide.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Predictive Intelligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our algorithms analyze traffic patterns, weather, and historical data to forecast AQI up to 6 hours ahead.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Personalized Health Profiles</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get tailored recommendations based on your age, health conditions, and activity level for maximum protection.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your location data stays on your device. We never store or share your personal information with third parties.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Updates</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Data refreshes every 5 minutes automatically, so you always have the most current air quality information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Impact Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                Health Impact
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Air Pollution Kills <span className="text-destructive">7 Million</span> People Every Year
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                According to the World Health Organization, air pollution is the single largest environmental health risk. Most deaths are linked to heart disease, stroke, chronic obstructive pulmonary disease, lung cancer, and acute respiratory infections.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <p className="text-muted-foreground">91% of the world population lives in places where air quality exceeds WHO guideline limits</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <p className="text-muted-foreground">Air pollution causes 1 in 8 deaths globally</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <p className="text-muted-foreground">Children and elderly are most vulnerable to pollution effects</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/education">
                  <Button variant="outline" className="rounded-xl border-2 bg-transparent">
                    Learn About AQI Standards
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-2xl border-2 border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">7M</p>
                  <p className="text-sm text-muted-foreground">Deaths per year from air pollution</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">91%</p>
                  <p className="text-sm text-muted-foreground">World population exposed to unsafe air</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-2 border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">4.2M</p>
                  <p className="text-sm text-muted-foreground">Deaths from outdoor pollution</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">80%</p>
                  <p className="text-sm text-muted-foreground">Preventable with air quality awareness</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-chart-4 to-accent p-1">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="relative rounded-[2.3rem] bg-gradient-to-br from-primary/95 via-chart-4/95 to-accent/95 p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Start for free today</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
                Ready to Breathe Easier?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who trust AeroGuard for real-time air quality insights and personalized health protection.
              </p>
              <Link href="/onboarding">
                <Button size="lg" className="text-lg px-12 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white text-primary font-bold hover:bg-white/90">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border/50 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AeroGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AeroGuard. Protecting your health, one breath at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
