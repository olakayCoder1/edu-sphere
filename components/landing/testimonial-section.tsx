"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const testimonials = [
  {
    quote: "EduSphere has transformed how I deliver my programming courses. The chapter-based approach with integrated quizzes ensures my students truly understand each concept before moving on.",
    name: "Dr. Sarah Johnson",
    role: "Computer Science Tutor",
    avatar: "SJ"
  },
  {
    quote: "As an administrator, I can easily oversee all activities across our institution. The analytics provide valuable insights into student engagement and performance.",
    name: "Michael Chen",
    role: "Education Administrator",
    avatar: "MC"
  },
  {
    quote: "The structured learning path and interactive quizzes helped me master complex material at my own pace. The live sessions are particularly engaging and helpful.",
    name: "Aisha Patel",
    role: "Engineering Student",
    avatar: "AP"
  }
];

export function TestimonialSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how EduSphere has empowered students, tutors, and administrators.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}