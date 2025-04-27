import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Video, Shield } from "lucide-react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EduSphere</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        {/* <FeatureSection /> */}
        {/* <TestimonialSection /> */}
        
        <section id="pricing" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Start Your Learning Journey Today</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
              <div className="bg-background rounded-lg shadow-lg p-8 flex-1">
                <h3 className="text-xl font-semibold mb-2">For Students</h3>
                <p className="text-muted-foreground mb-6">Access quality courses and grow your skills</p>
                <div className="text-3xl font-bold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Unlimited access to all courses</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Join live sessions</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Track your progress</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Earn certificates</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up?role=student">
                  <Button className="w-full">Sign Up as Student</Button>
                </Link>
              </div>
              
              <div className="bg-background rounded-lg shadow-lg p-8 flex-1 border-2 border-primary">
                <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full w-fit mx-auto mb-4">POPULAR</div>
                <h3 className="text-xl font-semibold mb-2">For Tutors</h3>
                <p className="text-muted-foreground mb-6">Create courses and teach students</p>
                <div className="text-3xl font-bold mb-6">$49<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Create unlimited courses</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Host live sessions</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Detailed analytics</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Revenue sharing</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up?role=tutor">
                  <Button className="w-full">Sign Up as Tutor</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}