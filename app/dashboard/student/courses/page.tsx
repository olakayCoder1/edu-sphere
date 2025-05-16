"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Course, Student } from "@/lib/types";
import courseService from "@/services/courseService";



export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch courses from the API
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const courses_response = await courseService.getCourses();
        // @ts-ignore
        setCourses(courses_response?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check for user info in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "student") {
        setStudent(user as Student);
      }
    }
    
    fetchCourses();
  }, []);

  // Get the enrolled courses for current student
  const getEnrolledCourses = useCallback(() => {
    if (!student) return courses;
    return courses.filter(course => 
      student.enrolledCourses.includes(String(course.id))
    );
  }, [student, courses]);

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
  }, [searchTerm, categoryFilter, statusFilter, courses, student,getEnrolledCourses]);

  // Get unique categories from courses
  const categories = ["all", ...Array.from(new Set(courses.map(course => course.category)))];

  // Group courses by status for tabs
  const coursesByStatus = {
    all: filteredCourses,
    "in-progress": filteredCourses.filter(course => course.status === "in_progress"),
    "not-started": filteredCourses.filter(course => course.status === "not_started"),
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
            
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : (
              Object.entries(coursesByStatus).map(([status, courses]) => (
                <TabsContent key={status} value={status} className="mt-0">
                  {courses.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {courses.map((course) => (
                        // @ts-ignore
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
              ))
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}