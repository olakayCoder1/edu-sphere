"use client";

import Link from "next/link";
import { PlayCircle, BookOpen, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  userRole: "admin" | "tutor" | "student";
}

export function CourseCard({ course, userRole }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          />
          {userRole === "student" && course.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
          )}
        </div>
        <CardContent className="flex-grow p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-primary/10 text-xs">
              {course.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {course.duration}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{course.totalChapters} chapters</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.students} students</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          {userRole === "student" ? (
            <Link href={`/dashboard/student/courses/${course.id}`} className="w-full">
              <Button variant="default" className="w-full gap-2">
                <PlayCircle className="h-4 w-4" />
                {course.progress === 0 ? "Start Learning" : "Continue Learning"}
              </Button>
            </Link>
          ) : userRole === "tutor" ? (
            <Link href={`/dashboard/tutor/courses/${course.id}`} className="w-full">
              <Button variant="default" className="w-full">
                Manage Course
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/admin/courses/${course.id}`} className="w-full">
              <Button variant="default" className="w-full">
                View Details
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}