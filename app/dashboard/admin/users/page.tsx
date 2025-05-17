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
  Search, FileText, RefreshCw, BookOpen, GraduationCap, Users, Laptop
} from "lucide-react";
import React from "react";

// Type definitions
type Student = {
  is_active: any;
  role: string;
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

type Tutor = {
  is_active: any;
  role: string;
  created_at?: string;
  updated_at?: string;
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  specialization?: string;
  joinedDate?: string;
  coursesCount?: number;
  studentsCount?: number;
  rating?: number;
};

export default function TutorStudentsPage() {
  // State for users and filters
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);


  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result?.filter(
        user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter(user => user.is_active === isActive);
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, roleFilter, users]);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsersAll();
      // @ts-ignore
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get status color
  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
  };

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="">
      <Header title="Users Management" />
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all users in the system
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
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
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="tutor">Tutors</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setRoleFilter("all");
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
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length > 0 ? (
                        currentItems.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  {user.profileImage ? (
                                    <AvatarImage src={user.profileImage} alt={user.name} />
                                  ) : (
                                    <AvatarFallback>
                                      {getInitials(user.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {user.role === "tutor" ? (
                                  <GraduationCap className="h-4 w-4 mr-1 text-blue-500" />
                                ) : (
                                  <Users className="h-4 w-4 mr-1 text-green-500" />
                                )}
                                <span className="text-sm capitalize">{user?.role || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user?.is_active)}>
                                {user?.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(user.created_at || "")}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedUser(user);
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
                              <Users className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-medium">No users found</h3>
                              <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                                  ? "Try adjusting your filters" 
                                  : "No users have been added yet"}
                              </p>
                              {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setRoleFilter("all");
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

                {filteredUsers?.length > itemsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedUser.role === "tutor" ? "Tutor Profile" : "Student Profile"}
              </DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser.role === "tutor" ? (
              // Tutor Profile View
              <div className="grid md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-2">
                      {selectedUser.profileImage ? (
                        <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {getInitials(selectedUser.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <Badge className="mt-2">Tutor</Badge>
                    
                    <div className="mt-4 w-full text-left">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Status</span>
                        <Badge className={getStatusColor(selectedUser.is_active)}>
                          {selectedUser.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Joined Date</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.created_at)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Last Updated</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.updated_at)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Specialization</span>
                        <span className="text-sm font-medium">{selectedUser.specialization || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Tutor Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                            <h4 className="font-medium">Courses</h4>
                          </div>
                          <p className="text-2xl font-bold">{selectedUser.coursesCount || 0}</p>
                          <p className="text-sm text-muted-foreground">Total courses created</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Users className="h-5 w-5 mr-2 text-green-500" />
                            <h4 className="font-medium">Students</h4>
                          </div>
                          <p className="text-2xl font-bold">{selectedUser.studentsCount || 0}</p>
                          <p className="text-sm text-muted-foreground">Total students taught</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Account Details</h4>
                        <Card>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-y-2">
                              <div className="text-sm text-muted-foreground">User ID</div>
                              <div className="text-sm font-medium">{selectedUser.id}</div>
                              
                              <div className="text-sm text-muted-foreground">Email</div>
                              <div className="text-sm font-medium">{selectedUser.email}</div>
                              
                              <div className="text-sm text-muted-foreground">Role</div>
                              <div className="text-sm font-medium capitalize">{selectedUser.role}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Student Profile View
              <div className="grid md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-2">
                      {selectedUser.profileImage ? (
                        <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {getInitials(selectedUser.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <Badge className="mt-2">Student</Badge>
                    
                    <div className="mt-4 w-full text-left">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Status</span>
                        <Badge className={getStatusColor(selectedUser.is_active)}>
                          {selectedUser.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Joined Date</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.created_at)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Last Updated</span>
                        <span className="text-sm font-medium">{formatDate(selectedUser.updated_at)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Courses Enrolled</span>
                        <span className="text-sm font-medium">{selectedUser?.courses?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Enrolled Courses</h3>
                  {selectedUser?.courses?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.courses.map((course: any) => (
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
                  ) : (
                    <Card className="bg-gray-50 dark:bg-gray-900/20 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No courses enrolled</h3>
                        <p className="text-muted-foreground text-center mt-2 mb-4">
                          This student is not currently enrolled in any courses.
                        </p>
                        <Button variant="outline">Enroll in a Course</Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Account Details</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-y-2">
                          <div className="text-sm text-muted-foreground">User ID</div>
                          <div className="text-sm font-medium">{selectedUser.id}</div>
                          
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="text-sm font-medium">{selectedUser.email}</div>
                          
                          <div className="text-sm text-muted-foreground">Role</div>
                          <div className="text-sm font-medium capitalize">{selectedUser.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}