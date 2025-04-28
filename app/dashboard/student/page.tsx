"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap,
  Clock,
  CalendarDays,
  Video,
  CheckCircle
} from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CourseCard } from "@/components/dashboard/course-card";
import { LiveClassCard } from "@/components/dashboard/live-class-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Course, LiveClass, Student } from "@/lib/types";
import { DEMO_COURSES, DEMO_LIVE_CLASSES } from "@/lib/constants";
// Adjusted DEMO_COURSES to match the expected Course type
// const DEMO_COURSES: Course[] = [
//   {
//     id: "course-1",
//     title: "Introduction to Programming",
//     description: "Learn the basics of programming.",
//     tutor: "John Doe",
//     thumbnail: "/images/programming-course.jpg",
//     totalChapters: 10,
//     completedChapters: 5,
//     progress: 50,
//     status: "in-progress",
//     category: "Programming",
//     level: "Beginner",
//     students: 120,
//     duration: "120",
//     chapters: [],
//   },
//   {
//     id: "course-2",
//     title: "Advanced React",
//     description: "Master React with advanced concepts.",
//     tutor: "Jane Smith",
//     thumbnail: "/images/react-course.jpg",
//     totalChapters: 15,
//     completedChapters: 15,
//     progress: 100,
//     status: "completed",
//     category: "Web Development",
//     level: "Advanced",
//     students: 80,
//     duration: "180",
//     chapters: [],
//   },
// ];

// // Adjusted DEMO_LIVE_CLASSES to match the expected LiveClass type
// const DEMO_LIVE_CLASSES: LiveClass[] = [
//   {
//     id: "class-1",
//     title: "Introduction to React",
//     course: "Web Development",
//     tutor: "John Doe",
//     date: "2023-11-25T10:00:00Z",
//     duration: 120,
//     status: "upcoming",
//     attendees: 50,
//     thumbnail: "/images/react-class.jpg",
//   },
//   {
//     id: "class-2",
//     title: "Advanced TypeScript",
//     course: "Programming",
//     tutor: "Jane Smith",
//     date: "2023-11-20T14:00:00Z",
//     duration: 90,
//     status: "completed",
//     attendees: 30,
//     thumbnail: "/images/typescript-class.jpg",
//     recording: "/recordings/typescript-class.mp4",
//   },
// ];

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Simulate loading data - in a real app, this would be API calls
    setCourses(DEMO_COURSES);
    setLiveClasses(DEMO_LIVE_CLASSES);
    
    // Sample recent activity data
    setRecentActivity([
      { 
        type: 'quiz_completed', 
        title: 'HTML Basics Quiz', 
        course: 'Introduction to Web Development',
        score: 85, 
        date: '2023-11-18T10:30:00Z' 
      },
      { 
        type: 'chapter_completed', 
        title: 'CSS Fundamentals', 
        course: 'Introduction to Web Development',
        date: '2023-11-17T14:45:00Z' 
      },
      { 
        type: 'live_class_attended', 
        title: 'JavaScript Closures Explained', 
        course: 'Introduction to Web Development',
        date: '2023-11-15T09:00:00Z' 
      }
    ]);
    
    // Sample upcoming deadlines
    setUpcomingDeadlines([
      { 
        type: 'quiz', 
        title: 'Introduction to APIs Quiz', 
        course: 'Introduction to Web Development',
        dueDate: '2023-11-25T23:59:00Z' 
      },
      { 
        type: 'assignment', 
        title: 'Create a Data Visualization', 
        course: 'Data Science Fundamentals',
        dueDate: '2023-11-28T23:59:00Z' 
      }
    ]);
    
    // Check for user info in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "student") {
        setStudent(user as Student);
      }
    }
  }, []);

  // Get the enrolled courses for current student
  const getEnrolledCourses = () => {
    if (!student) return courses;
    return courses.filter(course => 
      student.enrolledCourses.includes(course.id)
    );
  };

  // Count of active courses (with progress > 0 and < 100)
  const activeCourses = getEnrolledCourses().filter(
    course => course.progress !== undefined && course.progress > 0 && course.progress < 100
  ).length;

  // Calculate average progress across all courses
  const averageProgress = getEnrolledCourses().length > 0 
    ? Math.round(getEnrolledCourses().reduce((sum, course) => sum + (course.progress || 0), 0) / getEnrolledCourses().length)
    : 0;

  // Count completed courses
  const completedCourses = getEnrolledCourses().filter(
    course => course.progress === 100
  ).length;

  // Get upcoming live classes (sorted by date)
  const upcomingLiveClasses = liveClasses
    .filter(lc => lc.status === "upcoming" || lc.status === "live")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format date for display
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

  // Format due date with relative time
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays > 1 && diffDays < 7) return `Due in ${diffDays} days`;
    return `Due on ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}`;
  };

  return (
    <div>
      <Header title="Student Dashboard" />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={getEnrolledCourses().length}
            icon={<BookOpen className="h-5 w-5" />}
            change={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Active Courses"
            value={activeCourses}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatsCard
            title="Average Progress"
            value={`${averageProgress}%`}
            icon={<GraduationCap className="h-5 w-5" />}
          />
          <StatsCard
            title="Completed Courses"
            value={completedCourses}
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {getEnrolledCourses()
              .filter(course => course.status === "in-progress")
              .slice(0, 4)
              .map((course) => (
                <CourseCard key={course.id} course={course} userRole="student" />
              ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Live Classes</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {upcomingLiveClasses.slice(0, 2).map((liveClass) => (
                <LiveClassCard key={liveClass.id} liveClass={liveClass} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Upcoming Deadlines</h2>
            <Card>
              <CardContent className="p-4">
                {upcomingDeadlines.length > 0 ? (
                  <ul className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b last:border-0 pb-4 last:pb-0"
                      >
                        <div className="flex gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            deadline.type === 'quiz' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {deadline.type === 'quiz' ? (
                              <BookOpen className="h-5 w-5" />
                            ) : (
                              <CalendarDays className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{deadline.title}</h4>
                            <p className="text-sm text-muted-foreground">{deadline.course}</p>
                            <p className="text-xs mt-1 font-medium text-red-500">
                              {formatDueDate(deadline.dueDate)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No upcoming deadlines
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning activity over the past few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentActivity.map((activity, index) => (
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
                        {formatDate(activity.date)}
                      </p>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.course}</p>
                      {activity.type === 'quiz_completed' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span className="font-medium">{activity.score}%</span>
                          </div>
                          {/* <Progress value={parseFloat(activity.score)} className="h-1.5" /> */}
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