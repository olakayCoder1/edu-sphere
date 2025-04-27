import Link from "next/link";
import { BookOpen, Twitter, Linkedin, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">EduSphere</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Empowering education through innovative technology and structured learning experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/auth/sign-up" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
              <li><Link href="/auth/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-muted-foreground">Contact us at:</p>
            <p className="text-muted-foreground">support@edusphere.com</p>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}