"use client";

import Link from "next/link";
import { PlayCircle, BookOpen, Clock, BookOpenCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Update the Course interface to match your actual data structure
interface Course {
  status: string;
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
  user: string;
  // Additional properties that might be calculated or added client-side
  progress?: number;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  quizzes: Quiz[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  passing_score: number;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Option {
  id: number;
  text: string;
}

interface CourseCardProps {
  course: Course;
  userRole: "admin" | "tutor" | "student";
}

export function CourseCard({ course, userRole }: CourseCardProps) {
  // Calculate total lessons from the course data
  const totalLessons = course.lessons?.length || 0;
  
  // Format the creation date
  const formattedDate = new Date(course.created_at).toLocaleDateString();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Course #{course.id}
          </Badge>
          <div className="text-sm text-gray-500">
            <Clock className="mr-1 inline h-4 w-4" />
            Created {formattedDate}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-bold">{course.title}</h3>
        <p className="mb-4 text-gray-600">{course.description}</p>
        
        {userRole === "student" && course.progress !== undefined && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-sm">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            {/* <Progress value={course.progress || 0 } className="h-2" /> */}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="mr-1 h-4 w-4" />
            {totalLessons} lessons
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <BookOpenCheck className="mr-1 h-4 w-4" />
            {course?.lessons?.reduce((acc, lesson) => acc + (lesson.quizzes?.length || 0), 0)} quizzes
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 p-4">
        <Link
          href={
            userRole === "student"
              ? `/dashboard/student/courses/${course.id}`
              : userRole === "tutor"
              ? `/dashboard/tutor/courses/${course.id}`
              : `/courses/${course.id}`
          }
          className="w-full"
        >
          <Button
            className="w-full"
            variant={userRole === "student" ? "default" : "outline"}
          >
            {userRole === "student" ? (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                {/* {course.progress && course.progress > 0
                  ? "Continue Learning"
                  : "Start Learning"} */}
                  {course.status  == "in_progress"
                  ? "Continue Learning"
                  : course.status == "not_started" ? "Start Learning": "Explore"}
              </>
            ) : userRole === "tutor" ? (
              "Manage Course"
            ) : (
              "View Details"
            )}
          </Button>
        </Link>
      </CardFooter>

    </Card>
  );
}