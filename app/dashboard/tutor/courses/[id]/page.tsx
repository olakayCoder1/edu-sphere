"use client";

import { useState, useEffect, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Edit, Save, Trash2, BookOpen, CheckCircle,
  AlertCircle, HelpCircle, GripVertical, Loader2, Upload, X
} from "lucide-react";
import courseService from "@/services/courseService";

// For drag and drop functionality
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TutorCourseDetail() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    title: "",
    description: ""
  });
  
  // Modal states
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Load course data
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(Number(id));
        setCourse(response);
        setEditedCourse({
          title: response.title,
          description: response.description
        });
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const handleEditCourse = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      setSaving(true);
      await courseService.updateCourse(Number(id), editedCourse);
      setCourse({
        ...course,
        title: editedCourse.title,
        description: editedCourse.description
      });
      setEditMode(false);
      toast.success("Course updated successfully");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await courseService.deleteCourse(Number(id));
      toast.success("Course deleted successfully");
      router.push("/dashboard/tutor");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setEditedCourse({
      ...editedCourse,
      [name]: value
    });
  };

  // For lesson reordering
  const handleDragEnd = async (result:any) => {
    if (!result.destination) return;
    
    const items = Array.from(course.lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update lesson order
    const updatedLessons = items.map((lesson:any, index) => ({
      ...lesson,
      order: index + 1
    }));
    
    setCourse({
      ...course,
      lessons: updatedLessons
    });
    
    try {
      // TODO: Implement API call to save the new order
      toast.success("Lesson order updated successfully");
    } catch (error) {
      console.error("Error updating lesson order:", error);
      toast.error("Failed to update lesson order");
    }
  };

  // Handle updating course content with new PDF
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleFileChange = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRegenerateContent = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setRegenerating(true);
      
      const formData = new FormData();
      formData.append('pdf_file', selectedFile);
      
      // TODO: Implement API call to regenerate content
      
      toast.success("Course content regeneration started. This may take a few minutes.");
      
      // Close the dialog
      const closeBtn = document.getElementById('close-regenerate-dialog');
      if (closeBtn) {
        closeBtn.click();
      }
      
      // Refresh course data after a short delay
      setTimeout(() => {
        fetchCourseDetails();
      }, 2000);
      
    } catch (error) {
      console.error("Error regenerating course content:", error);
      toast.error("Failed to regenerate course content. Please try again.");
    } finally {
      setRegenerating(false);
      setSelectedFile(null);
    }
  };

  // Open lesson modal
  const openLessonModal = (lesson:any) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  // Open quiz modal
  const openQuizModal = (quiz:any, lesson:any) => {
    setSelectedQuiz({...quiz, lessonTitle: lesson.title});
    setIsQuizModalOpen(true);
  };

  // Function for fetching course details (reused after content regeneration)
  const fetchCourseDetails = async () => {
    try {
      const response = await courseService.getCourseById(Number(id));
      setCourse(response);
      setEditedCourse({
        title: response.title,
        description: response.description
      });
    } catch (error) {
      console.error("Error refreshing course details:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Course Management" />
        <main className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading course details...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header title="Course Management" />
        <main className="container mx-auto px-4 py-10">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-medium">Course not found</h3>
              <p className="text-muted-foreground text-center mt-2">
                The course you&#39;re looking for doesn&#39;t exist or you don&#39;t have permission to view it
              </p>
              <Button 
                variant="default" 
                className="mt-6"
                onClick={() => router.push("/dashboard/tutor")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="Course Management" />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/dashboard/tutor")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">
            {editMode ? (
              <Input
                name="title"
                value={editedCourse.title}
                onChange={handleInputChange}
                className="text-2xl font-bold h-auto py-1 px-2"
              />
            ) : (
              course.title
            )}
          </h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Course Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  {editMode ? (
                    <Textarea
                      name="description"
                      value={editedCourse.description}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p>{course.description}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                  <p>{new Date(course.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p>{new Date(course.updated_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                  <div className="flex items-center">
                    <span className="mr-2">{course.lessons?.length || 0} lessons</span>
                    <span className="mx-2">•</span>
                    <span>{course.lessons?.reduce((acc:any, lesson:any) => acc + (lesson.quizzes?.length || 0), 0)} quizzes</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button 
                className="w-full" 
                variant={editMode ? "default" : "outline"}
                onClick={handleEditCourse}
                disabled={saving}
              >
                {editMode ? (
                  saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </>
                )}
              </Button>
              
              {editMode ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setEditMode(false);
                    setEditedCourse({
                      title: course.title,
                      description: course.description
                    });
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      {/* <Button variant="outline" className="w-full">
                        <FileEdit className="mr-2 h-4 w-4" />
                        Update Content
                      </Button> */}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Course Content</DialogTitle>
                        <DialogDescription>
                          Upload a new PDF file to regenerate course lessons and quizzes. This will replace all existing content.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <Label htmlFor="pdf-update">Upload New PDF</Label>
                        <div className="mt-2 border border-input rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <Label htmlFor="pdf-upload" className="cursor-pointer">
                            {selectedFile ? (
                              <div className="flex items-center justify-center gap-2">
                                <Upload className="h-5 w-5" />
                                <span>{selectedFile.name}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Click to upload PDF file</p>
                              </div>
                            )}
                          </Label>
                          <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Warning: This will replace all course content including lessons and quizzes.
                        </p>
                      </div>
                      
                      <DialogFooter>
                        <Button id="close-regenerate-dialog" variant="outline">Cancel</Button>
                        <Button 
                          onClick={handleRegenerateContent}
                          disabled={!selectedFile || regenerating}
                        >
                          {regenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Regenerate Content"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Course
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the course
                          &quot;{course.title}&quot; and all its associated lessons and quizzes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCourse}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </CardFooter>
          </Card>
          
          {/* Course Content Management */}
          <div className="md:col-span-2">
            <Tabs defaultValue="lessons">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lessons</CardTitle>
                    <CardDescription>
                      Manage and reorder course lessons. Drag to reorder.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.lessons && course.lessons.length > 0 ? (
                      
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="lessons"></Droppable>
                          {(provided) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {course.lessons
                                .sort((a, b) => a.order - b.order)
                                .map((lesson, index) => (
                                <Draggable 
                                  key={`lesson-${lesson.id}`} 
                                  draggableId={`lesson-${lesson.id}`} 
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors"
                                    >
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="p-2 mr-2 rounded-md hover:bg-muted cursor-grab"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                            Lesson {index + 1}
                                          </Badge>
                                          <h3 className="font-medium">{lesson.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                          {lesson.content?.substring(0, 100)}...
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => openLessonModal(lesson)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <Droppable droppableId="lessons">
                          {(provided) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {course.lessons
                                .sort((a, b) => a.order - b.order)
                                .map((lesson, index) => (
                                <Draggable 
                                  key={`lesson-${lesson.id}`} 
                                  draggableId={`lesson-${lesson.id}`} 
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors"
                                    >
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="p-2 mr-2 rounded-md hover:bg-muted cursor-grab"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                            Lesson {index + 1}
                                          </Badge>
                                          <h3 className="font-medium">{lesson.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                          {lesson.content?.substring(0, 100)}...
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => openLessonModal(lesson)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No lessons yet</h3>
                        <p className="text-muted-foreground text-center mt-2">
                          Upload a new PDF to generate lessons automatically
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quizzes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>
                      View and manage quizzes for each lesson
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.lessons && course.lessons.some((lesson:any) => lesson.quizzes?.length > 0) ? (
                      <div className="space-y-6">
                        {course.lessons
                          .sort((a: { order: number; }, b: { order: number; }) => a.order - b.order)
                          .map((lesson: { quizzes: { id: any; title: any; questions: string | any[]; }[]; id: any; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, lessonIndex: number) => (
                          lesson.quizzes && lesson.quizzes.length > 0 ? (
                            <div key={`lesson-quizzes-${lesson.id}`} className="space-y-3">
                              <h3 className="font-medium flex items-center">
                                <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700">
                                  Lesson {lessonIndex + 1}
                                </Badge>
                                {lesson.title}
                              </h3>
                              <div className="space-y-2 ml-8">
                                {lesson.quizzes.map((quiz: { id: any; title: any; questions: string | any[]; }, quizIndex: number) => (
                                  <div 
                                    key={`quiz-${quiz.id}`}
                                    className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>Quiz {quizIndex + 1}:</span>
                                      <span className="font-medium">{quiz.title || `Quiz for ${lesson.title}`}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <span className="text-muted-foreground mr-4">
                                        {quiz.questions?.length || 0} questions
                                      </span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => openQuizModal(quiz, lesson)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <HelpCircle className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No quizzes yet</h3>
                        <p className="text-muted-foreground text-center mt-2">
                          Upload a new PDF to generate quizzes automatically
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Lesson View Modal */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedLesson?.title}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsLessonModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium mb-2">Lesson Content</h3>
              <p>{selectedLesson?.content}</p>
            </div>
            
            {selectedLesson?.quizzes && selectedLesson?.quizzes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Associated Quizzes</h3>
                <div className="space-y-2">
                  {selectedLesson?.quizzes.map((quiz:any) => (
                    <div 
                      key={`modal-quiz-${quiz.id}`}
                      className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setIsLessonModalOpen(false);
                        setTimeout(() => openQuizModal(quiz, selectedLesson), 100);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{quiz.title || `Quiz for ${selectedLesson.title}`}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {quiz.questions?.length || 0} questions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLessonModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quiz View Modal */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <span>{selectedQuiz?.title || "Quiz"}</span>
                <span className="text-sm text-muted-foreground block mt-1">
                  From: {selectedQuiz?.lessonTitle}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsQuizModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Quiz Questions</h3>
              <Badge variant="outline">
                Passing Score: {selectedQuiz?.passing_score || 70}%
              </Badge>
            </div>
            
            {selectedQuiz?.questions && selectedQuiz?.questions.length > 0 ? (
              <div className="space-y-8">
                {selectedQuiz.questions.map((question: { id: any; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; options: any[]; }, questionIndex: number) => (
                  <div key={`quiz-question-${question.id}`} className="border rounded-md p-4">
                    <h4 className="font-medium mb-3">
                      Question {questionIndex + 1}: {question.text}
                    </h4>
                    
                    <div className="space-y-2 ml-2">
                      {question.options.map((option:any) => (
                        <div key={`option-${option.id}`} className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={option.is_correct ? "bg-green-50 text-green-700" : ""}
                          >
                            {option.is_correct ? "Correct" : "Incorrect"}
                          </Badge>
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No questions available for this quiz.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuizModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}