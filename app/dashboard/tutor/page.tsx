"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CourseCard } from "@/components/dashboard/course-card";
import { LiveClassCard } from "@/components/dashboard/live-class-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, LiveClass, Tutor } from "@/lib/types";
// import { DEMO_COURSES, DEMO_LIVE_CLASSES } from "@/lib/constants";
import { 
  BookOpen, 
  Users, 
  Video,
  FileUp,
  BarChart3,
  Star,
  CalendarPlus,
  Clock,
  FileCheck,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const DEMO_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Programming",
    description: "Learn the basics of programming.",
    tutor: "John Doe",
    thumbnail: "/images/programming-course.jpg",
    totalChapters: 10,
    completedChapters: 5,
    progress: 50,
    status: "in-progress",
    category: "Programming",
    level: "Beginner",
    students: 120,
    duration: "120",
    chapters: [],
  },
  {
    id: "course-2",
    title: "Advanced React",
    description: "Master React with advanced concepts.",
    tutor: "Jane Smith",
    thumbnail: "/images/react-course.jpg",
    totalChapters: 15,
    completedChapters: 15,
    progress: 100,
    status: "completed",
    category: "Web Development",
    level: "Advanced",
    students: 80,
    duration: "180",
    chapters: [],
  },
];

// Adjusted DEMO_LIVE_CLASSES to match the expected LiveClass type
const DEMO_LIVE_CLASSES: LiveClass[] = [
  {
    id: "class-1",
    title: "Introduction to React",
    course: "Web Development",
    tutor: "John Doe",
    date: "2023-11-25T10:00:00Z",
    duration: 120,
    status: "upcoming",
    attendees: 50,
    thumbnail: "/images/react-class.jpg",
  },
  {
    id: "class-2",
    title: "Advanced TypeScript",
    course: "Programming",
    tutor: "Jane Smith",
    date: "2023-11-20T14:00:00Z",
    duration: 90,
    status: "completed",
    attendees: 30,
    thumbnail: "/images/typescript-class.jpg",
    recording: "/recordings/typescript-class.mp4",
  },
];



// Sample data for the chart
const engagementData = [
  { date: 'Mon', students: 45 },
  { date: 'Tue', students: 52 },
  { date: 'Wed', students: 49 },
  { date: 'Thu', students: 65 },
  { date: 'Fri', students: 59 },
  { date: 'Sat', students: 70 },
  { date: 'Sun', students: 74 },
];

export default function TutorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [tutor, setTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    // Simulate loading data - in a real app, this would be API calls
    setCourses(DEMO_COURSES);
    setLiveClasses(DEMO_LIVE_CLASSES);
    
    // Sample pending tasks data
    setPendingTasks([
      { 
        id: 'task-1',
        type: 'material',
        title: 'Upload lecture slides for JavaScript Functions', 
        dueDate: '2023-11-25T23:59:00Z'
      },
      {
        id: 'task-2',
        type: 'quiz',
        title: 'Create quiz for DOM Manipulation chapter',
        dueDate: '2023-11-26T23:59:00Z'
      },
      {
        id: 'task-3',
        type: 'review',
        title: 'Review student submissions for final project',
        dueDate: '2023-11-28T23:59:00Z'
      }
    ]);
    
    // Check for user info in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "tutor") {
        setTutor(user as Tutor);
      }
    }
  }, []);

  // Get upcoming live classes (sorted by date)
  const upcomingLiveClasses = liveClasses
    .filter(lc => lc.status === "upcoming" || lc.status === "live")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Total students across all courses
  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);

  // Count of active courses
  const totalCourses = courses.length;

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
      <Header title="Tutor Dashboard" />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Courses"
            value={totalCourses}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={<Users className="h-5 w-5" />}
            change={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Live Sessions"
            value={upcomingLiveClasses.length}
            description="Upcoming sessions"
            icon={<Video className="h-5 w-5" />}
          />
          <StatsCard
            title="Tutor Rating"
            value="4.8/5"
            icon={<Star className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Daily active students in your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="students" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1) / 0.2)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {pendingTasks.map((task, index) => (
                    <li key={task.id} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                      <div className="flex gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          task.type === 'material' 
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                            : task.type === 'quiz'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                              : 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          {task.type === 'material' ? (
                            <FileUp className="h-5 w-5" />
                          ) : task.type === 'quiz' ? (
                            <FileCheck className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-xs mt-1 font-medium text-red-500">
                            {formatDueDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="w-full mt-4 text-sm">
                  View All Tasks <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Courses</h2>
            <Link href="/dashboard/tutor/courses/new">
              <Button className="gap-2">
                <BookOpen className="h-4 w-4" /> Create New Course
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} userRole="tutor" />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboard/tutor/courses">
              <Button variant="outline">
                View All Courses <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Upcoming Live Classes</h2>
            <Link href="/dashboard/tutor/live-classes/new">
              <Button className="gap-2">
                <CalendarPlus className="h-4 w-4" /> Schedule Class
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingLiveClasses.slice(0, 3).map((liveClass) => (
              <LiveClassCard key={liveClass.id} liveClass={liveClass} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboard/tutor/live-classes">
              <Button variant="outline">
                View All Classes <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}