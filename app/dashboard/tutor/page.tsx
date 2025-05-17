"use client";


import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { CourseCard } from "@/components/dashboard/course-card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/lib/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import courseService from "@/services/courseService";
import { ArrowUpRight, Plus, FileText, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import CourseSummaryChart from "@/components/dashboard/summary-card";
import StudentEngagementChart from "@/components/dashboard/student-engagement-card";




export default function TutorDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseSummary, setCourseSummary] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: ""
  });


  useEffect(() => {
      fetchCourses();
      fetchCoursesSummary();

      const storedUser = localStorage.getItem("eduSphereUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "tutor") {
          setTutor(user as Tutor);
        }
      }
    }, []);





  const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourses();
        // @ts-ignore
        setCourses(response?.data || []); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };


    const fetchCoursesSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await courseService.getCoursesSummary();
        
        // Set course summary data
        setCourseSummary(response || []);
        console.log("Course summary fetched:", response);
      } catch (error) {
        console.error("Error fetching course summary:", error);
        toast.error("Failed to load course performance data.");
      } finally {
        setSummaryLoading(false);
      }
    };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value
    });
  };




  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      toast.error( "Please fill in all fields");
      return;
    }

    try {
      setUploadLoading(true);
      
      const formData = new FormData();
      formData.append('title', newCourse.title);
      formData.append('description', newCourse.description);
      formData.append('pdf_file', selectedFile);
      
      const response = await courseService.createCourseForm(formData);
      
      // Reset form
      setNewCourse({
        title: "",
        description: ""
      });
      setSelectedFile(null);
      
      // Add new course to the list or refetch courses
      fetchCourses();
      fetchCoursesSummary();
      
      toast.success("Course created successfully. Content generation in progress.");
      // Close the dialog - this needs to be handled by the parent component
      const closeBtn = document.getElementById('close-dialog-btn');
      if (closeBtn) {
        closeBtn.click();
      }
      
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div>
      <Header title="Tutor Dashboard" />
      <main className="container mx-auto px-4 py-6">

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-3">
            <StudentEngagementChart />
          </div>
          
          <div className="md:col-span-3">
            <CourseSummaryChart courseSummary={courseSummary} loading={summaryLoading} />
          </div>
        </div>

        <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Courses</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new course with title, description, and a PDF file that will be used to generate lessons and quizzes.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateCourse}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter course title"
                        value={newCourse.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter course description"
                        value={newCourse.description}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="pdf">Course Content (PDF)</Label>
                      <div className="border border-input rounded-md p-2">
                        <Label 
                          htmlFor="pdf-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer p-4 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
                        >
                          {selectedFile ? (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4" />
                              {selectedFile.name}
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Click to upload PDF file</span>
                            </>
                          )}
                        </Label>
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        This PDF will be used to automatically generate course lessons and quizzes.
                      </span>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button id="close-dialog-btn" type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploadLoading}>
                      {uploadLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Course"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
      </main>
    </div>
  );
}