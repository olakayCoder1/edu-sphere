"use client";

export default function TutorCourseManagement() {
  return <></>
}
// import { useState, useEffect } from "react";
// import { Header } from "@/components/dashboard/header";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Plus, Trash2, FileText, Upload, Loader2 } from "lucide-react";
// import { CourseCard } from "@/components/dashboard/course-card";
// import courseService from "@/services/courseService";
// import { toast } from "sonner";

// export default function TutorCourseManagement() {
//   const [courses, setCourses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [newCourse, setNewCourse] = useState({
//     title: "",
//     description: ""
//   });

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await courseService.getCourses();
//       // @ts-nocheck
//       setCourses(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId: number) => {
//     try {
//       setDeleteLoading(courseId);
//       await courseService.deleteCourse(courseId);
//       setCourses(courses.filter(course => course.id !== courseId));
//       toast.success("Course deleted successfully");
//     } catch (error) {
//       console.error("Error deleting course:", error);
//       toast.error("Failed to delete course. Please try again.");
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewCourse({
//       ...newCourse,
//       [name]: value
//     });
//   };

//   const handleCreateCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!selectedFile) {
//       toast.error("Please select a PDF file");
//       return;
//     }

//     if (!newCourse.title.trim() || !newCourse.description.trim()) {
//       toast.error( "Please fill in all fields");
//       return;
//     }

//     try {
//       setUploadLoading(true);
      
//       const formData = new FormData();
//       formData.append('title', newCourse.title);
//       formData.append('description', newCourse.description);
//       formData.append('pdf_file', selectedFile);
      
//       const response = await courseService.createCourseForm(formData);
      
//       // Reset form
//       setNewCourse({
//         title: "",
//         description: ""
//       });
//       setSelectedFile(null);
      
//       // Add new course to the list or refetch courses
//       fetchCourses();
      
//       toast.success("Course created successfully. Content generation in progress.");
//       // Close the dialog - this needs to be handled by the parent component
//       const closeBtn = document.getElementById('close-dialog-btn');
//       if (closeBtn) {
//         closeBtn.click();
//       }
      
//     } catch (error) {
//       console.error("Error creating course:", error);
//       toast.error("Failed to create course. Please try again.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header title="Course Management" />
      
//       <main className="container mx-auto px-4 py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Your Courses</h2>
          
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="gap-2">
//                 <Plus className="h-4 w-4" />
//                 Add New Course
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[500px]">
//               <DialogHeader>
//                 <DialogTitle>Create New Course</DialogTitle>
//                 <DialogDescription>
//                   Add a new course with title, description, and a PDF file that will be used to generate lessons and quizzes.
//                 </DialogDescription>
//               </DialogHeader>
              
//               <form onSubmit={handleCreateCourse}>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="title">Course Title</Label>
//                     <Input
//                       id="title"
//                       name="title"
//                       placeholder="Enter course title"
//                       value={newCourse.title}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid gap-2">
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea
//                       id="description"
//                       name="description"
//                       placeholder="Enter course description"
//                       value={newCourse.description}
//                       onChange={handleInputChange}
//                       className="min-h-[100px]"
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid gap-2">
//                     <Label htmlFor="pdf">Course Content (PDF)</Label>
//                     <div className="border border-input rounded-md p-2">
//                       <Label 
//                         htmlFor="pdf-upload" 
//                         className="flex flex-col items-center justify-center cursor-pointer p-4 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
//                       >
//                         {selectedFile ? (
//                           <div className="flex items-center gap-2 text-sm">
//                             <FileText className="h-4 w-4" />
//                             {selectedFile.name}
//                           </div>
//                         ) : (
//                           <>
//                             <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
//                             <span className="text-sm text-muted-foreground">Click to upload PDF file</span>
//                           </>
//                         )}
//                       </Label>
//                       <Input
//                         id="pdf-upload"
//                         type="file"
//                         accept=".pdf"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         required
//                       />
//                     </div>
//                     <span className="text-xs text-muted-foreground">
//                       This PDF will be used to automatically generate course lessons and quizzes.
//                     </span>
//                   </div>
//                 </div>
                
//                 <DialogFooter>
//                   <Button id="close-dialog-btn" type="button" variant="outline">
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={uploadLoading}>
//                     {uploadLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       "Create Course"
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
        
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <span className="ml-2">Loading courses...</span>
//           </div>
//         ) : courses.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center p-12">
//               <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium">No courses yet</h3>
//               <p className="text-muted-foreground text-center mt-2">
//   You haven&apos;t created any courses yet. Get started by adding your first course.
// </p>

//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button className="mt-6 gap-2">
//                     <Plus className="h-4 w-4" />
//                     Create Your First Course
//                   </Button>
//                 </DialogTrigger>
//                 {/* Dialog content same as above */}
//               </Dialog>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {courses.map((course) => (
//               <div key={course.id} className="relative group">
//                 <CourseCard course={course} userRole="tutor" />
                
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button 
//                       variant="destructive" 
//                       size="icon" 
//                       className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//   This action cannot be undone. This will permanently delete the course 
//   &quot;{course.title}&quot; and all its associated lessons and quizzes.
// </AlertDialogDescription>

//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={() => handleDeleteCourse(course.id)}
//                         disabled={deleteLoading === course.id}
//                       >
//                         {deleteLoading === course.id ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Deleting...
//                           </>
//                         ) : (
//                           "Delete"
//                         )}
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }