// "use client";

// import { useState, useEffect } from "react";
// import { Header } from "@/components/dashboard/header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Search,
//   BookOpen,
//   MoreVertical,
//   Eye,
//   Ban,
//   CheckCircle,
//   Loader2,
//   AlertTriangle,
//   Trash2,
//   Filter,
//   Award,
//   DollarSign,
//   Users,
//   Clock,
// } from "lucide-react";
// import Link from "next/link";

// export default function AdminCoursesManagement() {
//   // State for managing courses
//   interface Course {
//     id: string;
//     title: string;
//     description: string;
//     category: string;
//     level: string;
//     isPaid: boolean;
//     price: string;
//     chapters: number;
//     totalDuration: number;
//     status: "published" | "pending" | "under-review" | "rejected" | string;
//     featuredStatus: string;
//     enrollments: number;
//     createdAt: string;
//     tutor: {
//       id: string;
//       name: string;
//       image: string;
//     };
//     thumbnail: string;
//     rating: number;
//     reviewCount: number;
//   }
  
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewCourse, setViewCourse] = useState<Course | null>(null);
//   const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
//   const [selectedTab, setSelectedTab] = useState("all");
//   const [filters, setFilters] = useState({
//     category: "all",
//     status: "all",
//     pricing: "all",
//   });

//   // Pagination
//   const coursesPerPage = 10;
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
//   const startIndex = (currentPage - 1) * coursesPerPage;
//   const displayedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

//   // Mock data for demonstration purposes
//   useEffect(() => {
//     // Simulate API fetch
//     const fetchCourses = async () => {
//       try {
//         // In a real app, this would be an API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));
        
//         // Mock data
//         const mockCourses = [
//           {
//             id: "course-8",
//             title: "Digital Marketing Strategy",
//             description: "Comprehensive guide to creating effective digital marketing campaigns.",
//             category: "Marketing",
//             level: "Beginner",
//             isPaid: true,
//             price: "34.99",
//             chapters: 14,
//             totalDuration: 280,
//             status: "rejected" as "rejected",
//             featuredStatus: "regular",
//             enrollments: 0,
//             createdAt: "2025-04-20T13:45:00Z",
//             tutor: {
//               id: "tutor-8",
//               name: "James Wilson",
//               image: "/images/avatars/avatar-8.jpg"
//             },
//             thumbnail: "/images/courses/marketing.jpg",
//             rating: 0,
//             reviewCount: 0
//           },
//         ];
        
//         setCourses(mockCourses);
//         setFilteredCourses(mockCourses);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // Apply filters and search
//   useEffect(() => {
//     let filtered = [...courses];
    
//     // Apply tab filter
//     if (selectedTab === "pending") {
//       filtered = filtered.filter(course => course.status === "pending" || course.status === "under-review");
//     } else if (selectedTab === "published") {
//       filtered = filtered.filter(course => course.status === "published");
//     } else if (selectedTab === "rejected") {
//       filtered = filtered.filter(course => course.status === "rejected");
//     }
    
//     // Apply dropdown filters
//     if (filters.category !== "all") {
//       filtered = filtered.filter(course => course.category === filters.category);
//     }
    
//     if (filters.pricing !== "all") {
//       if (filters.pricing === "free") {
//         filtered = filtered.filter(course => !course.isPaid);
//       } else if (filters.pricing === "paid") {
//         filtered = filtered.filter(course => course.isPaid);
//       }
//     }
    
//     if (filters.status !== "all") {
//       filtered = filtered.filter(course => course.status === filters.status);
//     }
    
//     // Apply search
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         course => 
//           course.title.toLowerCase().includes(query) || 
//           course.description.toLowerCase().includes(query) ||
//           course.tutor.name.toLowerCase().includes(query)
//       );
//     }
    
//     setFilteredCourses(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [courses, selectedTab, filters, searchQuery]);

//   // Handle course status change
//   const handleStatusChange = (courseId: string, newStatus: "pending" | "rejected" | "published" | "under-review") => {
//     setCourses(prevCourses => 
//       prevCourses.map(course => 
//         course.id === courseId ? { ...course, status: newStatus } : course
//       )
//     );
//   };

//   // Handle course featured status change
//   const handleFeaturedStatusChange = (courseId: string, newStatus: string) => {
//     setCourses(prevCourses => 
//       prevCourses.map(course => 
//         course.id === courseId ? { ...course, featuredStatus: newStatus } : course
//       )
//     );
//   };

//   // Handle course deletion
//   const handleDeleteCourse = (courseId: string) => {
//     setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
//     setCourseToDelete(null);
//   };

//   // Categories for filter
//   const categories = [
//     "Programming",
//     "Web Development",
//     "Data Science",
//     "UI/UX Design",
//     "Mobile Development",
//     "Machine Learning",
//     "DevOps",
//     "Business",
//     "Marketing",
//     "Photography",
//     "Music",
//     "Other"
//   ];


//   // Status Badge Component
//   const StatusBadge = ({ status }: { status: "published" | "pending" | "under-review" | "rejected" }) => {
//       const statusMap: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary"; icon: React.ComponentType }> = {
//         "published": { label: "Published", variant: "default", icon: CheckCircle },
//         "pending": { label: "Pending", variant: "secondary", icon: Clock },
//         "under-review": { label: "Under Review", variant: "outline", icon: Loader2 },
//         "rejected": { label: "Rejected", variant: "destructive", icon: Ban }
//       };
      
//       const { label, variant, icon: Icon } = statusMap[status] || statusMap["pending"];
    
//     return (
//       <Badge variant={variant} className="flex items-center gap-1">
//         <Icon />
//         <span>{label}</span>
//       </Badge>
//     );
//   };

//   // Featured Badge Component
//   const FeaturedBadge = ({ status }: { status: string }) => {
//     if (status === "featured") {
//       return (
//         <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
//           <Award className="h-3 w-3" />
//           <span>Featured</span>
//         </Badge>
//       );
//     }
//     return null;
//   };

//   // Price Badge Component
//   const PriceBadge = ({ isPaid, price }: { isPaid: boolean; price: string }) => {
//     if (!isPaid) {
//       return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Free</Badge>;
//     }
//     return (
//       <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
//         <DollarSign className="h-3 w-3" />
//         <span>${parseFloat(price).toFixed(2)}</span>
//       </Badge>
//     );
//   };

//   return (
//     <div>
//       <Header title="Course Management" />
//       <main className="container mx-auto px-4 py-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">All Courses</h1>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm">
//               <Filter className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow">
//           <div className="p-4 border-b">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input 
//                   placeholder="Search courses, tutors..." 
//                   className="pl-9"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <Select
//                   value={filters.category}
//                   onValueChange={(value) => setFilters({...filters, category: value})}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="All Categories" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     {categories.map(category => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
                
//                 <Select
//                   value={filters.pricing}
//                   onValueChange={(value) => setFilters({...filters, pricing: value})}
//                 >
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Pricing" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Pricing</SelectItem>
//                     <SelectItem value="free">Free</SelectItem>
//                     <SelectItem value="paid">Paid</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 <Select
//                   value={filters.status}
//                   onValueChange={(value) => setFilters({...filters, status: value})}
//                 >
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="published">Published</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="under-review">Under Review</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//             <div className="px-4 pt-2">
//               <TabsList className="grid grid-cols-4 w-full max-w-md">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="pending">Pending</TabsTrigger>
//                 <TabsTrigger value="published">Published</TabsTrigger>
//                 <TabsTrigger value="rejected">Rejected</TabsTrigger>
//               </TabsList>
//             </div>

//             <TabsContent value={selectedTab} className="m-0">
//               {isLoading ? (
//                 <div className="flex justify-center items-center p-12">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               ) : filteredCourses.length === 0 ? (
//                 <div className="text-center p-12">
//                   <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
//                   <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
//                   <p className="text-muted-foreground">
//                     Try adjusting your search or filter to find what you're looking for.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Course</TableHead>
//                         <TableHead>Category</TableHead>
//                         <TableHead>Tutor</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Enrollments</TableHead>
//                         <TableHead>Price</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {displayedCourses.map((course) => (
//                         <TableRow key={course.id}>
//                           <TableCell>
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
//                                 {course.thumbnail ? (
//                                   <Image
//                                     src={course.thumbnail}
//                                     alt={course.title}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <BookOpen className="h-5 w-5 text-muted-foreground" />
//                                 )}
//                               </div>
//                               <div>
//                                 <div className="font-medium">{course.title}</div>
//                                 <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
//                                   <span>{course.level}</span>
//                                   <span>•</span>
//                                   <span>{course.chapters} chapters</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 mt-1">
//                                   <FeaturedBadge status={course.featuredStatus} />
//                                 </div>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant="outline">{course.category}</Badge>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
//                                 {course.tutor.image ? (
//                                   <Image 
//                                     src={course.tutor.image}
//                                     alt={course.tutor.name}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <Users className="h-4 w-4 text-muted-foreground" />
//                                 )}
//                               </div>
//                               <span className="text-sm">{course.tutor.name}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <StatusBadge status={course.status as "pending" | "rejected" | "published" | "under-review"} />
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-1">
//                               <Users className="h-4 w-4 text-muted-foreground" />
//                               <span>{course.enrollments}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <PriceBadge isPaid={course.isPaid} price={course.price} />
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm">
//                               {new Date(course.createdAt).toLocaleDateString()}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="icon">
//                                   <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuItem onClick={() => setViewCourse(course)}>
//                                   <Eye className="h-4 w-4 mr-2" />
//                                   View Details
//                                 </DropdownMenuItem>
//                                 {course.status !== "published" && (
//                                   <DropdownMenuItem 
//                                     onClick={() => handleStatusChange(course.id, "published")}
//                                   >
//                                     <CheckCircle className="h-4 w-4 mr-2" />
//                                     Approve & Publish
//                                   </DropdownMenuItem>
//                                 )}
//                                 {course.status !== "rejected" && (
//                                   <DropdownMenuItem 
//                                     onClick={() => handleStatusChange(course.id, "rejected")}
//                                     className="text-destructive"
//                                   >
//                                     <Ban className="h-4 w-4 mr-2" />
//                                     Reject Course
//                                   </DropdownMenuItem>
//                                 )}
//                                 {course.featuredStatus !== "featured" && (
//                                   <DropdownMenuItem
//                                     onClick={() => handleFeaturedStatusChange(course.id, "featured")}
//                                   >
//                                     <Award className="h-4 w-4 mr-2" />
//                                     Mark as Featured
//                                   </DropdownMenuItem>
//                                 )}
//                                 {course.featuredStatus === "featured" && (
//                                   <DropdownMenuItem
//                                     onClick={() => handleFeaturedStatusChange(course.id, "regular")}
//                                   >
//                                     <Award className="h-4 w-4 mr-2" />
//                                     Remove Featured
//                                   </DropdownMenuItem>
//                                 )}
//                                 <DropdownMenuItem 
//                                   onClick={() => setCourseToDelete(course)}
//                                   className="text-destructive"
//                                 >
//                                   <Trash2 className="h-4 w-4 mr-2" />
//                                   Delete Course
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}

//               {filteredCourses.length > 0 && (
//                 <div className="px-4 py-4 border-t">
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious 
//                           onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                         //   disabled={currentPage === 1}
//                         />
//                       </PaginationItem>
                      
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         // Logic to show page numbers around current page
//                         let pageNum;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
                        
//                         return (
//                           <PaginationItem key={i}>
//                             <PaginationLink 
//                               isActive={pageNum === currentPage}
//                               onClick={() => setCurrentPage(pageNum)}
//                             >
//                               {pageNum}
//                             </PaginationLink>
//                           </PaginationItem>
//                         );
//                       })}
                      
//                       {totalPages > 5 && currentPage < totalPages - 2 && (
//                         <PaginationItem>
//                           <PaginationEllipsis />
//                         </PaginationItem>
//                       )}
                      
//                       <PaginationItem>
//                         <PaginationNext 
//                           onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                         //   disabled={currentPage === totalPages}
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>

//       {/* Course Details Dialog */}
//       {viewCourse && (
//         <Dialog open={Boolean(viewCourse)} onOpenChange={() => setViewCourse(null)}>
//           <DialogContent className="max-w-3xl">
//             <DialogHeader>
//               <DialogTitle>Course Details</DialogTitle>
//               <DialogDescription>
//                 Complete information about the selected course.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//               <div>
//                 <div className="bg-muted rounded-md overflow-hidden mb-4">
//                   {viewCourse.thumbnail ? (
//                     <Image
//                       src={viewCourse.thumbnail}
//                       alt={viewCourse.title}
//                       className="w-full aspect-video object-cover"
//                     />
//                   ) : (
//                     <div className="w-full aspect-video flex items-center justify-center">
//                       <BookOpen className="h-12 w-12 text-muted-foreground" />
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <Label className="text-muted-foreground">Status</Label>
//                     <div className="mt-1">
//                       <StatusBadge status={viewCourse.status as "pending" | "rejected" | "published" | "under-review"} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <Label className="text-muted-foreground">Category</Label>
//                     <div className="mt-1">
//                       <Badge variant="outline">{viewCourse.category}</Badge>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <Label className="text-muted-foreground">Level</Label>
//                     <div className="mt-1">
//                       <Badge variant="outline">{viewCourse.level}</Badge>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <Label className="text-muted-foreground">Price</Label>
//                     <div className="mt-1">
//                       <PriceBadge isPaid={viewCourse.isPaid} price={viewCourse.price} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <Label className="text-muted-foreground">Featured Status</Label>
//                     <div className="mt-1">
//                       {viewCourse.featuredStatus === "featured" ? (
//                         <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
//                           Featured
//                         </Badge>
//                       ) : (
//                         <Badge variant="outline">Regular</Badge>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div>
//                     <Label className="text-muted-foreground">Created On</Label>
//                     <div className="text-sm mt-1">
//                       {new Date(viewCourse.createdAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="md:col-span-2">
//                 <h2 className="text-xl font-bold">{viewCourse.title}</h2>
//                 <p className="mt-2 text-muted-foreground">{viewCourse.description}</p>
                
//                 <div className="mt-6 grid grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader className="py-4">
//                       <CardTitle className="text-sm font-medium flex items-center gap-2">
//                         <BookOpen className="h-4 w-4" />
//                         Course Statistics
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="py-2">
//                       <div className="grid grid-cols-2 gap-y-2">
//                         <div>
//                           <div className="text-xs text-muted-foreground">Chapters</div>
//                           <div className="font-medium">{viewCourse.chapters}</div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-muted-foreground">Duration</div>
//                           <div className="font-medium">{viewCourse.totalDuration} min</div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-muted-foreground">Enrollments</div>
//                           <div className="font-medium">{viewCourse.enrollments}</div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-muted-foreground">Rating</div>
//                           <div className="font-medium">
//                             {viewCourse.rating > 0 ? (
//                               <span>{viewCourse.rating}/5 ({viewCourse.reviewCount} reviews)</span>
//                             ) : (
//                               <span>No ratings yet</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
                  
//                   <Card>
//                     <CardHeader className="py-4">
//                       <CardTitle className="text-sm font-medium flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Tutor Information
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="py-2">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
//                           {viewCourse.tutor.image ? (
//                             <Image
//                               src={viewCourse.tutor.image}
//                               alt={viewCourse.tutor.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <Users className="h-5 w-5 text-muted-foreground" />
//                           )}
//                         </div>
//                         <div>
//                           <div className="font-medium">{viewCourse.tutor.name}</div>
//                           <Link href={`/dashboard/admin/tutors/${viewCourse.tutor.id}`} className="text-xs text-primary hover:underline">
//                             View Tutor Profile
//                           </Link>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
                
//                 <h3 className="text-lg font-medium mt-6">Administrative Actions</h3>
                
//                 <div className="mt-4 space-y-3">
//                   {viewCourse.status !== "published" && (
//                     <div className="flex items-center justify-between p-3 rounded-md border">
//                       <div>
//                         <h4 className="font-medium">Approve & Publish</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Make this course available to students
//                         </p>
//                       </div>
//                       <Button
//                         onClick={() => {
//                           handleStatusChange(viewCourse.id, "published");
//                           setViewCourse({...viewCourse, status: "published"});
//                         }}
//                       >
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Approve
//                       </Button>
//                     </div>
//                   )}
                  
//                   {viewCourse.status !== "rejected" && (
//                     <div className="flex items-center justify-between p-3 rounded-md border">
//                       <div>
//                         <h4 className="font-medium">Reject Course</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Mark this course as rejected
//                         </p>
//                       </div>
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           handleStatusChange(viewCourse.id, "rejected");
//                           setViewCourse({...viewCourse, status: "rejected"});
//                         }}
//                       >
//                         <Ban className="h-4 w-4 mr-2" />
//                         Reject
//                       </Button>
//                     </div>
//                   )}
                  
//                   <div className="flex items-center justify-between p-3 rounded-md border">
//                     <div>
//                       <h4 className="font-medium">
//                         {viewCourse.featuredStatus === "featured" ? "Remove Featured Status" : "Mark as Featured"}
//                       </h4>
//                       <p className="text-sm text-muted-foreground">
//                         {viewCourse.featuredStatus === "featured" 
//                           ? "Remove this course from featured courses" 
//                           : "Highlight this course on the platform"}
//                       </p>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         const newStatus = viewCourse.featuredStatus === "featured" ? "regular" : "featured";
//                         handleFeaturedStatusChange(viewCourse.id, newStatus);
//                         setViewCourse({...viewCourse, featuredStatus: newStatus});
//                       }}
//                     >
//                       <Award className="h-4 w-4 mr-2" />
//                       {viewCourse.featuredStatus === "featured" ? "Remove Featured" : "Mark Featured"}
//                     </Button>
//                   </div>
                  
//                   <div className="flex items-center justify-between p-3 rounded-md border">
//                     <div>
//                       <h4 className="font-medium">Delete Course</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Permanently remove this course
//                       </p>
//                     </div>
//                     <Button
//                       variant="destructive"
//                       onClick={() => {
//                         setCourseToDelete(viewCourse);
//                         setViewCourse(null);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setViewCourse(null)}>
//                 Close
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {courseToDelete && (
//         <AlertDialog open={Boolean(courseToDelete)} onOpenChange={() => setCourseToDelete(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Delete Course</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to delete "{courseToDelete.title}"? This action cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                 onClick={() => handleDeleteCourse(courseToDelete.id)}
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       )}
//     </div>
//   );
// }

// page.tsx
'use client'; // This tells Next.js to treat this component as a client component.

import React from "react";

const Page = () => {
  return <div>Page content here</div>;
};

export default Page;
