"use client";

import { ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import userService from "@/services/userService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search, FileText, RefreshCw, BookOpen
} from "lucide-react";
import React from "react";

// Type definitions
type Student = {
  created_at?: string;
  updated_at?: string;
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  lastActive?: string;
  coursesEnrolled: number;
  progress: number;
  status: 'active' | 'inactive' | 'completed';
  grade?: string;
  profileImage?: string;
  courses: {
    title: ReactNode;
    id: string;
    name: string;
    progress: number;
    lastAccessed?: string;
  }[];
};


export default function TutorStudentsPage() {
  // State for students and filters
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Get unique courses from all students
  const allCourses = React.useMemo(() => {
    const courses = new Set<string>();
    students.forEach(student => {
      student.courses.forEach((course: { name: string; }) => {
        courses.add(course.name);
      });
    });
    return Array.from(courses);
  }, [students]);


  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...students];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(student => student.status === statusFilter);
    }

    // Apply course filter
    if (courseFilter !== "all") {
      result = result.filter(student => 
        student.courses.some((course: { name: string; }) => course.name === courseFilter)
      );
    }

    setFilteredStudents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, courseFilter, students]);


    useEffect(() => {
      fetchStudents();
    }, []);
  
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getStudents();
        console.log(response)
        setStudents(response || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };


  // Get color for student status badge
  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };


  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };



  return (
    <div className="">
      <Header title="Student Management" />
      <main className="container mx-auto px-4 py-6">
        {/* Student Stats Cards */}
        {/* <div className="grid gap-6 md:grid-cols-4 my-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of {students.length} total students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Course Completions
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Students who completed all courses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                At-Risk Students
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{atRiskStudents}</div>
              <div className="flex mt-1">
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs text-primary"
                  onClick={() => {
                    setCourseFilter('all');
                    setStatusFilter('active');
                  }}
                >
                  View at-risk students
                </Button>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>My Students</CardTitle>
              <CardDescription>
                Track their progress of your students
              </CardDescription>
            </div>
          
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {allCourses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCourseFilter("all");
                  }}
                  title="Reset filters"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length > 0 ? (
                        currentItems.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  {student.profileImage ? (
                                    <AvatarImage src={student.profileImage} alt={student.name} />
                                  ) : (
                                    <AvatarFallback>
                                      {getInitials(student.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-muted-foreground">{student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(student.enrolledAt)}</div>
                              <div className="text-xs text-muted-foreground">
                                {student.coursesEnrolled} course{student.coursesEnrolled !== 1 ? 's' : ''}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(student.status)}>
                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                              </Badge>
                              {student.lastActive && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Last active: {formatDate(student.updated_at || "")}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                         
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setIsDetailsDialogOpen(true);
                                  }}
                                  title="View details"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center">
                              <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-medium">No students found</h3>
                              <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all" || courseFilter !== "all" 
                                  ? "Try adjusting your filters" 
                                  : "Try adjusting your filters"}
                              </p>
                              {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setCourseFilter("all");
                                  }}
                                >
                                  Clear Filters
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredStudents?.length > itemsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        //   disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNumber: number;
                        
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else {
                          if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              isActive={currentPage === pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        //   disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Student Details Dialog */}
      {selectedStudent && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Student Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedStudent.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-3 gap-6 py-4">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-2">
                    {selectedStudent.profileImage ? (
                      <AvatarImage src={selectedStudent.profileImage} alt={selectedStudent.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {getInitials(selectedStudent.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="text-lg font-medium">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>

                  
                  <div className="mt-4 w-full text-left">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Status</span>
                      <Badge className={getStatusColor(selectedStudent.status)}>
                        {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Enrolled Date</span>
                      <span className="text-sm font-medium">{formatDate(selectedStudent.updated_at || "")}</span>
                    </div>
                    {selectedStudent.lastActive && (
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Last Active</span>
                        <span className="text-sm font-medium">{formatDate(selectedStudent.lastActive)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Courses Enrolled Count</span>
                      <span className="text-sm font-medium">{selectedStudent?.courses?.length || 0}</span>
                    </div>
                    {/* {selectedStudent.grade && (
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Current Grade</span>
                        <span className={`text-sm font-bold ${getGradeColor(selectedStudent.grade)}`}>
                          {selectedStudent.grade}
                        </span>
                      </div>
                    )} */}
                  </div>
                  
                  <div className="mt-6 flex gap-2">
  
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Enrolled Courses</h3>
                <div className="space-y-4">
                  {selectedStudent.courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-md">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(course.progress)}`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        {course.lastAccessed && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Last accessed: {formatDate(course.lastAccessed)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}