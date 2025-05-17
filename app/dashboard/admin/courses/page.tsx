"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import {
  Loader2, Eye, Trophy, CheckCircle,
  AlertTriangle, Ban, MoreHorizontal, Download, UserX
} from "lucide-react";
import courseService from "@/services/courseService";
import { FilterBar } from "@/components/ui/filter-bar";


// ------------------ Types ------------------
interface Tutor {
  id: number;
  name: string;
  email?: string;
}

interface Lesson {
  quizzes?: unknown[];
}

interface Course {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  status: string;
  visibility_status:string;
  featured: boolean;
  lessons?: Lesson[];
  user?: Tutor;
  enrollment_count?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ---------------- Component ----------------
export default function AdminCourseManagement() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tutorFilter, setTutorFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchCourses();
    fetchTutors();
  }, [pagination.currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();

      setCourses(response.data || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.meta?.totalPages || 1,
        totalItems: response.meta?.totalItems || 0
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await courseService.getTutors();
      setTutors(response?.data || []);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    // Update all filter states at once
    setSearchQuery(newFilters.search || "");
    setStatusFilter(newFilters.status || "all");
    setSortBy(newFilters.sortBy || "newest");
    setTutorFilter(newFilters.tutor || "");
    
    // Reset to first page when filters change
    setPagination(prev => ({...prev, currentPage: 1}));
    
    // Fetch courses with new filters
    fetchCourses();
  };

  const handleStatusChange = async (courseId: number, newStatus: string) => {
    try {
      setActionLoading(courseId);
      await courseService.updateCourse(courseId, {
        visibility_status: newStatus,
        title: "",
        description: ""
      });
      setCourses(prev =>
        prev.map(course =>
          course.id === courseId ? { ...course, visibility_status: newStatus } : course
        )
      );
      toast.success(`Course ${getStatusActionText(newStatus)}`);
    } catch (error) {
      toast.error("Failed to update course status.");
    } finally {
      setActionLoading(null);
    }
  };


  const handleDeleteCourse = async (courseId: number) => {
    try {
      setActionLoading(courseId);
      await courseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      toast.success("Course deleted.");
    } catch (error) {
      toast.error("Failed to delete course.");
    } finally {
      setActionLoading(null);
    }
  };



  const getStatusActionText = (status: string) => {
    switch (status) {
      case "active": return "activated";
      case "pending": return "marked for review";
      case "rejected": return "rejected";
      case "archived": return "archived";
      default: return "updated";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeMap: Record<string, string> = {
      active: "green",
      pending: "yellow",
      rejected: "red",
      archived: "gray",
      inactive: "gray"
    };
    const color = badgeMap[status] || "gray";
    return (
      <Badge className={`bg-${color}-100 text-${color}-800 hover:bg-${color}-200`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Create filter options for the FilterBar component
  const getFilterOptions = () => {
    // Create filter configurations
    const filterOptions = {
      status: {
        placeholder: "Filter by status",
        width: "w-[160px]",
        defaultValue: "all",
        options: [
          { value: "all", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "pending", label: "Pending Review" },
          { value: "rejected", label: "Rejected" },
          { value: "archived", label: "Archived" },
        ],
      },
      sortBy: {
        placeholder: "Sort by",
        width: "w-[160px]",
        defaultValue: "newest",
        options: [
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "title_asc", label: "Title (A-Z)" },
          { value: "title_desc", label: "Title (Z-A)" },
          { value: "popular", label: "Most Popular" },
        ],
      },
      tutor: {
        placeholder: "Filter by tutor",
        width: "w-[180px]",
        defaultValue: "",
        options: [
          { value: "*", label: "All Tutors" },
          ...tutors.map(tutor => ({
            value: tutor.id.toString(),
            label: tutor.name
          }))
        ],
      },
    };
    
    return filterOptions;
  };

  return (
    <div>
      <Header title="Admin Course Management" />
      
      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all tutors and statuses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {courses.filter(c => c.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Visible to students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {courses.filter(c => c.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {courses.filter(c => c.featured).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Displayed prominently to students
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="my-6">
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace the old filter UI with the new FilterBar component */}
            <FilterBar
              onFiltersChange={handleFiltersChange}
              filterOptions={getFilterOptions()}
              searchPlaceholder="Search courses by title, description, or tutor"
              initialFilters={{
                status: statusFilter,
                sortBy: sortBy,
                tutor: tutorFilter,
                search: searchQuery,
              }}
              className="mb-6"
            />

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground mt-2">
                  No courses match your current filters. Try changing your search criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium flex items-center gap-2">
                                {course.title}
                                {course.featured && (
                                  <Trophy className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {course.lessons?.length || 0} lessons • 
                                {course.lessons?.reduce((acc, lesson) => acc + (lesson.quizzes?.length || 0), 0)} quizzes
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{course.user?.name || "Unknown"}</span>
                              <span className="text-sm text-muted-foreground">{course.user?.email || ""}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(course.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(course.visibility_status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    {actionLoading === course.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <MoreHorizontal className="h-4 w-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  
                                  {course.visibility_status !== "active" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(course.id, "active")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      Approve Course
                                    </DropdownMenuItem>
                                  )}
                                  
                                  
                                  {course.visibility_status !== "inactive" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(course.id, "inactive")}
                                    >
                                      <Ban className="h-4 w-4 mr-2 text-red-600" />
                                      Disable
                                    </DropdownMenuItem>
                                  )}
                                  
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        Delete Course
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the course &quot;{course.title}&quot; and all its associated lessons, quizzes, and student progress.

                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-600"
                                          onClick={() => handleDeleteCourse(course.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                    {pagination.totalItems} courses
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}