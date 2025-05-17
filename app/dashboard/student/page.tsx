"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap,
  Clock, Video,
  CheckCircle
} from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CourseCard } from "@/components/dashboard/course-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import courseService from "@/services/courseService";

// Remove the async keyword from the component function
export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    // Move the async functionality inside useEffect
    const fetchCourses = async () => {
      try {
        const courses_response = await courseService.getInProgressCourses();
        // @ts-nocheck
        setCourses(courses_response?.data || []); 
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    
    fetchCourses();
  }, []);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div> 
      <Header title="Student Dashboard" />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={courses.length || 0}
            icon={<BookOpen className="h-5 w-5" />}
            change={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Active Courses"
            value={courses.filter(course => !course.completed).length || 0}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatsCard
            title="Average Progress"
            value={`${courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / courses.length) : 0}%`}
            icon={<GraduationCap className="h-5 w-5" />}
          />
          <StatsCard
            title="Completed Courses"
            value={courses.filter(course => course.completed).length || 0}
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>

        {/* <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses
              .slice(0, 4)
              .map((course) => (
                <CourseCard key={course.id} course={course} userRole="student" />
              ))}
          </div>
        </div> */}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning activity over the past few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {courses?.map((activity:any, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex"
                  >
                    <div className="mr-4 flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.type === 'quiz_completed' 
                          ? 'bg-green-100 text-green-600' 
                          : activity.type === 'chapter_completed'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'quiz_completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : activity.type === 'chapter_completed' ? (
                          <BookOpen className="h-5 w-5" />
                        ) : (
                          <Video className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4 h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </p>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.course}</p>
                      {activity.type === 'quiz_completed' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span className="font-medium">{activity.score}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

