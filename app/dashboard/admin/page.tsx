"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CourseCard } from "@/components/dashboard/course-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course, LiveClass,Admin } from "@/lib/types";
// import { DEMO_USERS } from "@/lib/constants";

// Adjusted DEMO_COURSES to match the expected Course type
const DEMO_COURSES: Course[] = [];

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
  }
];
import { 
  BookOpen, 
  Users, 
  Video,
  GraduationCap,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  School
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from "date-fns";

// Sample data for the charts
const registrationData = [
  { month: 'Jan', students: 120, tutors: 8 },
  { month: 'Feb', students: 150, tutors: 10 },
  { month: 'Mar', students: 200, tutors: 15 },
  { month: 'Apr', students: 180, tutors: 12 },
  { month: 'May', students: 250, tutors: 18 },
  { month: 'Jun', students: 300, tutors: 20 },
  { month: 'Jul', students: 280, tutors: 17 },
  { month: 'Aug', students: 320, tutors: 22 },
  { month: 'Sep', students: 380, tutors: 25 },
  { month: 'Oct', students: 400, tutors: 28 },
  { month: 'Nov', students: 450, tutors: 32 },
];

const engagementData = [
  { date: '11/15', active: 280 },
  { date: '11/16', active: 300 },
  { date: '11/17', active: 320 },
  { date: '11/18', active: 305 },
  { date: '11/19', active: 350 },
  { date: '11/20', active: 390 },
  { date: '11/21', active: 370 },
];

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Simulate loading data - in a real app, this would be API calls
    setCourses(DEMO_COURSES);
    setLiveClasses(DEMO_LIVE_CLASSES);
    
    // Sample recent activity data
    setRecentActivity([
      { 
        type: 'course_published', 
        title: 'Introduction to Machine Learning', 
        tutor: 'Dr. Sarah Johnson',
        date: '2023-11-20T10:30:00Z' 
      },
      { 
        type: 'live_class_scheduled', 
        title: 'Advanced Database Concepts', 
        tutor: 'Prof. Michael Chen',
        date: '2023-11-19T14:45:00Z' 
      },
      { 
        type: 'user_joined', 
        name: 'Jessica Thompson',
        role: 'student',
        date: '2023-11-18T09:00:00Z' 
      }
    ]);
    
    // Sample new users data
    setNewUsers([
      { 
        id: 'user-1',
        name: 'Jessica Thompson',
        email: 'jessica.t@example.com',
        role: 'student',
        status: 'approved',
        registeredAt: '2023-11-20T08:30:00Z'
      },
      {
        id: 'user-2',
        name: 'Mark Williams',
        email: 'mark.w@example.com',
        role: 'tutor',
        status: 'pending',
        registeredAt: '2023-11-19T15:20:00Z'
      },
      {
        id: 'user-3',
        name: 'Sophia Chen',
        email: 'sophia.c@example.com',
        role: 'student',
        status: 'approved',
        registeredAt: '2023-11-19T11:45:00Z'
      }
    ]);
    
    // Check for user info in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        setAdmin(user as Admin);
      }
    }
  }, []);

  // Count of total courses
  const totalCourses = courses.length;

  // Total students across all courses
  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);

  // Total tutors (for demo purposes)
  const totalTutors = 25;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div>
      <Header title="Admin Dashboard" />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={<GraduationCap className="h-5 w-5" />}
            change={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Total Tutors"
            value={totalTutors}
            icon={<Users className="h-5 w-5" />}
            change={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Courses"
            value={totalCourses}
            icon={<BookOpen className="h-5 w-5" />}
            change={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Live Classes"
            value={liveClasses.length}
            description="This month"
            icon={<Video className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Registrations</CardTitle>
              <CardDescription>Monthly registration trends for students and tutors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="students" 
                      name="Students" 
                      fill="hsl(var(--chart-1))" 
                    />
                    <Bar 
                      dataKey="tutors" 
                      name="Tutors" 
                      fill="hsl(var(--chart-2))" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Daily active users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="active" 
                      name="Active Users"
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.type === 'course_published' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                            : activity.type === 'live_class_scheduled'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                        }`}>
                          {activity.type === 'course_published' ? (
                            <BookOpen className="h-5 w-5" />
                          ) : activity.type === 'live_class_scheduled' ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <UserCheck className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4 h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(activity.date)}
                        </p>
                        <h4 className="font-medium">
                          {activity.type === 'course_published' 
                            ? `New course published: ${activity.title}` 
                            : activity.type === 'live_class_scheduled'
                              ? `Live class scheduled: ${activity.title}`
                              : `New ${activity.role} joined: ${activity.name}`}
                        </h4>
                        {(activity.type === 'course_published' || activity.type === 'live_class_scheduled') && (
                          <p className="text-sm text-muted-foreground">by {activity.tutor}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>New User Registrations</CardTitle>
                <CardDescription>Recent user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {newUsers.map((user) => (
                    <li key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={user.role === 'student' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'}>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={user.role === 'student' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'}>{user.role}</Badge>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      {user.status === 'pending' ? (
                        <Button size="sm" variant="outline" className="ml-2">Approve</Button>
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="w-full mt-4 text-sm">
                  View All Users <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Top Courses</h2>
            <Link href="/dashboard/admin/courses">
              <Button variant="outline">
                View All Courses <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses
              .sort((a, b) => (b.students || 0) - (a.students || 0))
              .slice(0, 3)
              .map((course) => (
                // <CourseCard key={course.id} course={course} userRole="admin" />
                <></>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}