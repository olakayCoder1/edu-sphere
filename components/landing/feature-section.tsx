"use client";

import { BookOpen, Users, Video, Shield, BarChart3, Layers } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-blue-500" />,
    title: "Comprehensive Courses",
    description: "Access a wide range of high-quality courses with structured learning paths."
  },
  {
    icon: <Video className="h-10 w-10 text-teal-500" />,
    title: "Live Sessions",
    description: "Join interactive live classes and collaborate with tutors and peers in real-time."
  },
  {
    icon: <Layers className="h-10 w-10 text-purple-500" />,
    title: "Chapter-based Learning",
    description: "Progress through well-structured chapters with quizzes to reinforce your knowledge."
  },
  {
    icon: <Users className="h-10 w-10 text-orange-500" />,
    title: "Dedicated Tutors",
    description: "Learn from experienced tutors who create and maintain quality learning materials."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-green-500" />,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed progress and performance analytics."
  },
  {
    icon: <Shield className="h-10 w-10 text-red-500" />,
    title: "Admin Oversight",
    description: "Professional administration ensures high-quality educational standards."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeatureSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Learning Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools needed for effective teaching and learning experiences.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-background rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}