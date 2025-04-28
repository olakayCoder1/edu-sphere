"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { CourseCard } from "@/components/dashboard/course-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Course, LiveClass, Student } from "@/lib/types";
// import { DEMO_COURSES } from "@/lib/constants";

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


export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Simulate loading courses
    setCourses(DEMO_COURSES);
    setFilteredCourses(DEMO_COURSES);
    
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

  // Apply filters when any filter changes
  useEffect(() => {
    let result = getEnrolledCourses();
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.category ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(course => course.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(course => course.status === statusFilter);
    }
    
    setFilteredCourses(result);
  }, [searchTerm, categoryFilter, statusFilter, courses, student]);

  // Get unique categories from courses
  const categories = ["all", ...Array.from(new Set(courses.map(course => course.category)))];

  // Group courses by status for tabs
  const coursesByStatus = {
    all: filteredCourses,
    "in-progress": filteredCourses.filter(course => course.status === "in-progress"),
    "not-started": filteredCourses.filter(course => course.status === "not-started"),
    completed: filteredCourses.filter(course => course.status === "completed"),
  };

  return (
    <div>
      <Header title="My Courses" />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category || "unknown"}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Courses ({coursesByStatus.all.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({coursesByStatus["in-progress"].length})</TabsTrigger>
              <TabsTrigger value="not-started">Not Started ({coursesByStatus["not-started"].length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({coursesByStatus.completed.length})</TabsTrigger>
            </TabsList>
            
            {Object.entries(coursesByStatus).map(([status, courses]) => (
              <TabsContent key={status} value={status} className="mt-0">
                {courses.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} userRole="student" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || categoryFilter !== "all"
                        ? "Try adjusting your filters"
                        : "You don't have any courses in this category yet"}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}