"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Empower Your Learning Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              A comprehensive learning platform designed for students, tutors, and administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1">
                <div className="bg-background rounded-xl overflow-hidden">
                  <Image 
                    src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg" 
                    alt="Student learning online" 
                    className="w-full h-auto" 
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <p className="font-medium">Live Class in Progress</p>
                </div>
                <p className="text-sm text-muted-foreground">25 students currently learning React Framework</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}