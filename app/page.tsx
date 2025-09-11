import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Globe,
  Palette,
  Heart,
  Smile,
  ArrowRight,
  Star,
  Users,
  Sparkles,
  MessageCircle,
  Gift,
  Lightbulb,
  LogOut,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react'
import { getAuthSession } from '@/auth/session'
import SignOutButton from '@/components/global/sign-out-button'

export default async function Home() {
  const sessionData = await getAuthSession()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SiteBillboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/pricing">Just $1/day!</Link>
              </Button>

              {sessionData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sessionData.user.image || undefined} alt={sessionData.user.name} />
                        <AvatarFallback className="text-sm">
                          {sessionData.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">{sessionData.user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SignOutButton/>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Launch your digital Billboard!
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            Share Your
            <span className="block text-transparent bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text">
              Awesome Ideas
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Got a cool joke? A sweet message for friends? A brilliant idea to share?
            Rent your own subdomain and let the world see your creativity!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 group" asChild>
              <Link href="/signup">
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/demo">See Examples</Link>
            </Button>
          </div>

          {/* Pricing Highlight */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
              <span className="text-primary font-semibold text-lg">Only $1 for your first day!</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span>4.9/5</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Creative Minds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Perfect for Every Creative Idea
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether it's funny, heartfelt, or just plain awesome - we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smile,
                title: "Share Your Jokes",
                description: "Got a hilarious joke or meme? Create your own space to make people laugh and brighten their day"
              },
              {
                icon: Heart,
                title: "Surprise Friends",
                description: "Send special birthday wishes, anniversary messages, or just because you care - make it personal and memorable"
              },
              {
                icon: Lightbulb,
                title: "Show Off Ideas",
                description: "Have a cool concept, invention, or creative project? Display it beautifully and get the attention it deserves"
              },
              {
                icon: Gift,
                title: "Create Fun Experiences",
                description: "Build interactive games, puzzles, or surprises for friends and family to discover and enjoy"
              },
              {
                icon: MessageCircle,
                title: "Express Yourself",
                description: "Whether it's poetry, thoughts, or random musings - create your own little corner of the internet"
              },
              {
                icon: Palette,
                title: "Make It Beautiful",
                description: "Easy-to-use tools to make your page look exactly how you want - no design skills needed!"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Will You Create?
            </h2>
            <p className="text-xl text-muted-foreground">
              Here's what others are sharing...
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                subdomain: "bestjoke2025.sitebillboard.com",
                title: "Daily Dad Jokes",
                description: "Mike shares a new dad joke every day that makes his coworkers groan (in a good way!)"
              },
              {
                subdomain: "happybirthday-sarah.sitebillboard.com",
                title: "Surprise Party Invite",
                description: "Jenny created a secret page for Sarah's surprise birthday with photos and messages from friends"
              },
              {
                subdomain: "my-awesome-invention.sitebillboard.com",
                title: "Cool Invention Showcase",
                description: "Alex shows off their latest gadget idea with photos, videos, and a fun interactive demo"
              }
            ].map((example, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-sm text-primary font-mono bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
                    {example.subdomain}
                  </div>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {example.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl">
            <CardContent className="py-16 px-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Share Your Awesomeness?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creative people who've made their mark online. Your idea deserves its own space!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/signup">Create My Page</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">Ask Questions</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Just $1 for your first day • No commitment • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SiteBillboard</span>
            </div>

            <div className="flex space-x-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 SiteBillboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}