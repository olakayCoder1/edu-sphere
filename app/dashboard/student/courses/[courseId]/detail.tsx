"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    BookOpen, Award,
    PlayCircle, CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import courseService from "@/services/courseService"; // Import courseService for API calls

// Updated type definitions to match the actual data structure
type Option = {
  is_correct: Option;
  id: number;
  text: string;
}

type Question = {
  id: number;
  text: string;
  options: Option[];
}

type Quiz = {
  id: number;
  title: string;
  questions: Question[];
  passing_score: number;
  timeLimit?: number; // Added for UI compatibility
}

type Lesson = {
  id: number;
  title: string;
  content: string;
  order: number;
  quizzes: Quiz[];
  completion_status: "completed" | "in_progress" | "not_started";
}

type Course = {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
  user: string;
  progress?: number; // Added for UI compatibility
}

export default function CourseDetail({ courseData }: { courseData: Course }) {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizTab, setQuizTab] = useState("preview");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizTimer, setQuizTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for tracking API submission


  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
  
    // Reset quiz state when changing lessons
    setQuizStarted(false);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
    if (quizTimer) clearInterval(quizTimer);
  
    // Set the first quiz as active if available
    if (lesson?.quizzes && lesson.quizzes.length > 0) {
      const quizWithTimeLimit = {
        ...lesson.quizzes[0],
        timeLimit: lesson.quizzes[0].timeLimit || 3,
      };
      setActiveQuiz(quizWithTimeLimit);
    } else {
      setActiveQuiz(null);
    }
  }, [quizTimer]);

  
  // Initialize the course data
  useEffect(() => {
    if (courseData) {
      // Calculate progress based on completed lessons
      const completedCount = courseData.lessons.filter(
        lesson => lesson.completion_status === "completed"
      ).length;
      const totalLessons = courseData.lessons.length;
      const calculatedProgress = totalLessons > 0 
        ? Math.round((completedCount / totalLessons) * 100) 
        : 0;

      setCourse({
        ...courseData,
        progress: courseData.progress || calculatedProgress
      });
      
      // Set the first lesson as active by default
      if (courseData.lessons && courseData.lessons.length > 0) {
        handleLessonSelect(courseData.lessons[0]);
      }
    }
  }, [courseData,handleLessonSelect]);



  const startQuiz = () => {
    setQuizStarted(true);
    setQuizTab("quiz");
    setQuizAnswers(Array(activeQuiz?.questions.length || 0).fill(-1));
    setTimeLeft(activeQuiz?.timeLimit ? activeQuiz.timeLimit * 60 : 600); // convert minutes to seconds
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setQuizTimer(timer);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // Function to call the API to mark lesson as completed
  const markLessonAsCompleted = async (courseId: number, lessonId: number) => {
    setIsSubmitting(true);
    try {
      // Call the API endpoint to mark the lesson as completed
      await courseService.completeLesson(courseId, lessonId);
      updateLessonCompletionStatus(lessonId, "completed");    

    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      // Handle error - you could show a notification/alert here
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    if (quizTimer) clearInterval(quizTimer);
    
    // Calculate score
    let correctAnswers = 0;
    if (activeQuiz && activeLesson && course) {
      activeQuiz.questions.forEach((question, index) => {
        // Check if the selected option is correct by finding the option with is_correct=true
        const selectedOptionIndex = quizAnswers[index];
        console.log(selectedOptionIndex)
        if (selectedOptionIndex >= 0) {
          const selectedOption = question.options[selectedOptionIndex];
          console.log(selectedOption.is_correct)
          console.log(selectedOption.text)
          if (selectedOption && selectedOption.is_correct) {
            correctAnswers++;
          }
        }
      });
      
      const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100);
      console.log(score)
      setQuizScore(score);
      
      // If score is greater than or equal to passing score, mark lesson as completed
      if (score >= activeQuiz.passing_score) {
        // Make API call to mark lesson as completed
        await markLessonAsCompleted(course.id, activeLesson.id);
      }
    }
    
    setQuizSubmitted(true);
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper function to get completion status badge variant
  const getCompletionBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Helper function to get completion status display text
  const getCompletionStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  // Update lesson completion status
  const updateLessonCompletionStatus = (lessonId: number, newStatus: "completed" | "in_progress" | "not_started") => {
    if (!course) return;
    
    const updatedLessons = course.lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, completion_status: newStatus } 
        : lesson
    );
    
    // Recalculate progress
    const completedCount = updatedLessons.filter(
      lesson => lesson.completion_status === "completed"
    ).length;
    const totalLessons = updatedLessons.length;
    const calculatedProgress = Math.round((completedCount / totalLessons) * 100);
    
    setCourse({
      ...course,
      lessons: updatedLessons,
      progress: calculatedProgress
    });
  };

  if (!course) {
    return (
      <div>
        <Header title="Course" />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mr-2">
              <ChevronLeft className="h-5 w-5 mr-1" /> Back
            </Button>
          </div>
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Course not found</h3>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title={course.title} />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm font-medium">{course.progress || 0}%</span>
                  </div>
                  <Progress value={course.progress || 0} className="h-2" />
                </div>
                <ul className="divide-y">
                  {course.lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <button
                        className={cn(
                          "w-full text-left p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors",
                          activeLesson?.id === lesson.id && "bg-muted"
                        )}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="mt-0.5">
                          {lesson.completion_status === "completed" ? (
                            <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          ) : lesson.completion_status === "in_progress" ? (
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              <PlayCircle className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-xs font-medium text-muted-foreground">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <BookOpen className="h-3.5 w-3.5 mr-1" /> Lesson
                            </span>
                            {lesson.quizzes && lesson.quizzes.length > 0 && (
                              <span className="flex items-center">
                                <Award className="h-3.5 w-3.5 mr-1" /> Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            {activeLesson && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Lesson {course.lessons.findIndex(l => l.id === activeLesson.id) + 1}/{course.lessons.length}
                    </Badge>
                    <Badge variant={getCompletionBadgeVariant(activeLesson.completion_status)}>
                      {getCompletionStatusText(activeLesson.completion_status)}
                    </Badge>
                  </div>
                  <CardTitle>{activeLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      {activeQuiz && (
                        <TabsTrigger 
                          value="quiz"
                          onClick={() => setQuizTab("preview")}
                        >
                          Quiz
                        </TabsTrigger>
                      )}
                    </TabsList>
                    <TabsContent value="content">
                      <div className="space-y-4">
                        {activeLesson?.content ? (
                          <div>
                            {activeLesson.content}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <h3 className="text-lg font-medium mb-2">Lesson content not available</h3>
                            <p className="text-muted-foreground">This is a placeholder for the lesson content.</p>
                          </div>
                        )}
                        
                        <Separator className="my-8" />
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            disabled={course.lessons.findIndex(l => l.id === activeLesson.id) === 0}
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
                              if (currentIndex > 0) {
                                handleLessonSelect(course.lessons[currentIndex - 1]);
                              }
                            }}
                          >
                            Previous Lesson
                          </Button>
                          <Button 
                            disabled={
                              course.lessons.findIndex(l => l.id === activeLesson.id) === course.lessons.length - 1 ||
                              // Disable Next Lesson button if current lesson is not completed
                              (activeLesson.completion_status !== "completed" && 
                               course.lessons.findIndex(l => l.id === activeLesson.id) < course.lessons.length - 1)
                            }
                            onClick={() => {
                              const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
                              if (currentIndex < course.lessons.length - 1) {
                                handleLessonSelect(course.lessons[currentIndex + 1]);
                              }
                            }}
                          >
                            Next Lesson
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {activeQuiz && (
                      <TabsContent value="quiz">
                        {quizTab === "preview" && !quizStarted && !quizSubmitted && (
                          <div className="text-center py-8">
                            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-bold mb-2">{activeQuiz?.title}</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Complete this quiz to test your knowledge and progress to the next lesson.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-6 max-w-lg mx-auto">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Questions</p>
                                  <p className="font-medium">{activeQuiz?.questions.length} questions</p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Time Limit</p>
                                  <p className="font-medium">{activeQuiz?.timeLimit || 3} minutes</p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Passing Score</p>
                                  <p className="font-medium">{activeQuiz?.passing_score || 70}%</p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Attempts</p>
                                  <p className="font-medium">Unlimited</p>
                                </div>
                              </div>
                              <Button onClick={startQuiz} className="w-full">Start Quiz</Button>
                            </div>
                          </div>
                        )}
                        
                        {quizStarted && !quizSubmitted && (
                          <div>
                            <div className="flex justify-between items-center mb-6">
                              <h2 className="text-xl font-bold">{activeQuiz?.title}</h2>
                              <div className="bg-muted px-3 py-1 rounded-full">
                                <span className="font-medium">Time Left: {formatTime(timeLeft)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-8">
                              {activeQuiz?.questions?.map((question, qIndex) => (
                                <div key={question.id} className="border rounded-lg p-6">
                                  <h3 className="text-lg font-medium mb-4">
                                    {qIndex + 1}. {question.text}
                                  </h3>
                                  <div className="space-y-3">
                                    {question.options.map((option, oIndex) => (
                                      <div 
                                        key={option.id}
                                        className={cn(
                                          "border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                                          quizAnswers[qIndex] === oIndex && "border-primary bg-primary/5"
                                        )}
                                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                      >
                                        <div className="flex items-center">
                                          <div className={cn(
                                            "h-5 w-5 rounded-full border mr-3 flex items-center justify-center",
                                            quizAnswers[qIndex] === oIndex && "border-primary bg-primary text-primary-foreground"
                                          )}>
                                            {quizAnswers[qIndex] === oIndex && <div className="h-2 w-2 rounded-full bg-current"></div>}
                                          </div>
                                          <span>{option.text}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-8 flex justify-between">
                              <Button variant="outline" onClick={() => setQuizTab("preview")}>
                                Back to Overview
                              </Button>
                              <Button onClick={submitQuiz} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {quizSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-8"
                          >
                            {quizScore >= (activeQuiz?.passing_score || 70) ? (
                              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                            ) : (
                              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                            )}
                            
                            <h2 className="text-2xl font-bold mb-2">
                              {quizScore >= (activeQuiz?.passing_score || 70) ? "Quiz Passed!" : "Quiz Failed"}
                            </h2>
                            
                            <p className="text-muted-foreground mb-6">
                              {quizScore >= (activeQuiz?.passing_score || 70) 
                                ? "Great job! You've successfully completed this quiz." 
                                : "Don't worry, you can review the material and try again."}
                            </p>
                            
                            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto mb-8">
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                                <div className="flex items-center justify-center gap-2">
                                  <Progress value={quizScore} className="h-3 w-40" />
                                  <span className="font-bold text-lg">{quizScore}%</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Passing Score</p>
                                  <p className="font-medium">{activeQuiz?.passing_score}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Time Taken</p>
                                  <p className="font-medium">{activeQuiz?.timeLimit || 3 - Math.floor(timeLeft / 60)} min</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Button onClick={() => {
                                setQuizStarted(false);
                                setQuizSubmitted(false);
                                setQuizTab("preview");
                              }} variant="outline">
                                Try Again
                              </Button>
                              
                              {quizScore >= (activeQuiz?.passing_score || 70) && (
                                <Button onClick={() => {
                                  // Move to next lesson if available
                                  const currentIndex = course.lessons.findIndex(l => l.id === activeLesson?.id);
                                  if (currentIndex < course.lessons.length - 1) {
                                    // Set next lesson to in_progress if it's not already completed
                                    const nextLesson = course.lessons[currentIndex + 1];
                                    if (nextLesson.completion_status !== "completed") {
                                      updateLessonCompletionStatus(nextLesson.id, "in_progress");
                                    }
                                    
                                    // Reset quiz states before changing lessons
                                    setQuizStarted(false);
                                    setQuizSubmitted(false);
                                    setQuizTab("preview");
                                    setQuizAnswers([]);
                                    setQuizScore(0);
                                    if (quizTimer) clearInterval(quizTimer);
                                    
                                    // Select the next lesson
                                    handleLessonSelect(course.lessons[currentIndex + 1]);
                                    
                                    // Set the active tab to content to ensure lesson content is shown
                                    const tabsElement = document.querySelector('[role="tablist"]');
                                    if (tabsElement) {
                                      const contentTab = tabsElement.querySelector('[value="content"]');
                                      if (contentTab) {
                                        (contentTab as HTMLElement).click();
                                      }
                                    }
                                  }
                                }}>
                                  Continue to Next Lesson
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}