
"use client";

import { useEffect, useState } from "react";
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
import { Course, Chapter, Quiz } from "@/lib/types";
import { DEMO_QUIZ,DEMO_COURSES } from "@/lib/constants";



// const DEMO_COURSES: Course[] = [
//   {
//     id: "course-1",
//     title: "Introduction to Programming",
//     description: "Learn the basics of programming.",
//     tutor: "John Doe",
//     thumbnail: "/images/programming-course.jpg",
//     totalChapters: 10,
//     completedChapters: 5,
//     progress: 50,
//     status: "in-progress",
//     category: "Programming",
//     level: "Beginner",
//     students: 120,
//     duration: "120",
//     chapters: [],
//   },
//   {
//     id: "course-2",
//     title: "Advanced React",
//     description: "Master React with advanced concepts.",
//     tutor: "Jane Smith",
//     thumbnail: "/images/react-course.jpg",
//     totalChapters: 15,
//     completedChapters: 15,
//     progress: 100,
//     status: "completed",
//     category: "Web Development",
//     level: "Advanced",
//     students: 80,
//     duration: "180",
//     chapters: [],
//   },
// ];




export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizTab, setQuizTab] = useState("preview");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizTimer, setQuizTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch course data
    const courseId = params.courseId as string;
    const foundCourse = DEMO_COURSES.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse as Course);
      // Set first chapter as active by default
      if (foundCourse.chapters.length > 0) {
        setActiveChapter(foundCourse.chapters[0]);   
        // If it's the first chapter, load the quiz sample
        if (foundCourse.chapters[0].id === "ch-1") {
          setActiveQuiz(DEMO_QUIZ);
        } else {
          setActiveQuiz(null);
        }
      }
    }
  }, [params.courseId]);

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    
    // Reset quiz state when changing chapters
    setQuizStarted(false);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
    if (quizTimer) clearInterval(quizTimer);
    
    // Load quiz for the selected chapter (demo only has quiz for first chapter)
    if (chapter.id === "ch-1") {
      setActiveQuiz(DEMO_QUIZ);
    } else {
      setActiveQuiz(null);
    }
  };

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

  const submitQuiz = () => {
    if (quizTimer) clearInterval(quizTimer);
    
    // Calculate score
    let correctAnswers = 0;
    if (activeQuiz) {
      activeQuiz.questions.forEach((question, index) => {
        if (quizAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100);
      setQuizScore(score);
    }
    
    setQuizSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          {/* Left Sidebar - Chapter List */}
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
                  {/* <Progress value={course.progress || 0} className="h-2" /> */}
                </div>
                <ul className="divide-y">
                  {course.chapters.map((chapter, index) => (
                    <li key={chapter.id}>
                      <button
                        className={cn(
                          "w-full text-left p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors",
                          activeChapter?.id === chapter.id && "bg-muted"
                        )}
                        onClick={() => handleChapterSelect(chapter)}
                      >
                        <div className="mt-0.5">
                          {chapter.isCompleted ? (
                            <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-xs font-medium text-muted-foreground">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{chapter.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <BookOpen className="h-3.5 w-3.5 mr-1" /> Lesson
                            </span>
                            {chapter.id === "ch-1" && (
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
            {activeChapter && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Chapter {course.chapters.findIndex(ch => ch.id === activeChapter.id) + 1}/{course.chapters.length}
                    </Badge>
                    <Badge variant={activeChapter.isCompleted ? "default" : "outline"}>
                      {activeChapter.isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <CardTitle>{activeChapter.title}</CardTitle>
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
                      {/* Sample content for demo */}
                      <div className="space-y-4">
                        {activeChapter.id === "ch-1" ? (
                          <>
                            <h2 className="text-xl font-semibold">Introduction to HTML</h2>
                            <p>HTML (Hypertext Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</p>
                            
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                              <Button variant="outline" size="lg" className="gap-2">
                                <PlayCircle className="h-5 w-5" /> Watch Video Lesson
                              </Button>
                            </div>
                            
                            <h3 className="text-lg font-medium mt-6">Basic Structure</h3>
                            <p>Every HTML document has a required structure that includes the following declaration and elements:</p>
                            
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                              <code>{`<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>`}</code>
                            </pre>
                            
                            <h3 className="text-lg font-medium mt-6">Common HTML Elements</h3>
                            <ul className="list-disc pl-6 space-y-2">
                              <li><strong>Headings</strong>: <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code></li>
                              <li><strong>Paragraphs</strong>: <code>&lt;p&gt;</code></li>
                              <li><strong>Links</strong>: <code>&lt;a&gt;</code></li>
                              <li><strong>Images</strong>: <code>&lt;img&gt;</code></li>
                              <li><strong>Lists</strong>: <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code></li>
                              <li><strong>Divisions</strong>: <code>&lt;div&gt;</code></li>
                            </ul>
                            
                            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                              <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" /> Important Note
                              </h4>
                              <p className="text-sm text-blue-700 dark:text-blue-400">
                                HTML is about structure, not style. For applying styles to your HTML elements, you should use CSS.
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <h3 className="text-lg font-medium mb-2">Chapter content not available in the demo</h3>
                            <p className="text-muted-foreground">This is a placeholder for the chapter content.</p>
                          </div>
                        )}
                        
                        <Separator className="my-8" />
                        
                        <div className="flex justify-between">
                          <Button variant="outline" disabled={course.chapters.findIndex(ch => ch.id === activeChapter.id) === 0}>
                            Previous Chapter
                          </Button>
                          <Button disabled={course.chapters.findIndex(ch => ch.id === activeChapter.id) === course.chapters.length - 1}>
                            Next Chapter
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {activeQuiz && (
                      <TabsContent value="quiz">
                        {quizTab === "preview" && !quizStarted && !quizSubmitted && (
                          <div className="text-center py-8">
                            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-bold mb-2">{activeQuiz.title}</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Complete this quiz to test your knowledge and progress to the next chapter.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-6 max-w-lg mx-auto">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Questions</p>
                                  <p className="font-medium">{activeQuiz.questions.length} questions</p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Time Limit</p>
                                  <p className="font-medium">{activeQuiz.timeLimit} minutes</p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-muted-foreground">Passing Score</p>
                                  <p className="font-medium">{activeQuiz.passingScore}%</p>
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
                              <h2 className="text-xl font-bold">{activeQuiz.title}</h2>
                              <div className="bg-muted px-3 py-1 rounded-full">
                                <span className="font-medium">Time Left: {formatTime(timeLeft)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-8">
                              {activeQuiz.questions.map((question, qIndex) => (
                                <div key={question.id} className="border rounded-lg p-6">
                                  <h3 className="text-lg font-medium mb-4">
                                    {qIndex + 1}. {question.question}
                                  </h3>
                                  <div className="space-y-3">
                                    {question.options.map((option, oIndex) => (
                                      <div 
                                        key={oIndex}
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
                                          <span>{option}</span>
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
                              <Button onClick={submitQuiz}>
                                Submit Quiz
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
                            {quizScore >= (activeQuiz.passingScore || 70) ? (
                              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                            ) : (
                              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                            )}
                            
                            <h2 className="text-2xl font-bold mb-2">
                              {quizScore >= (activeQuiz.passingScore || 70) ? "Quiz Passed!" : "Quiz Failed"}
                            </h2>
                            
                            <p className="text-muted-foreground mb-6">
                              {quizScore >= (activeQuiz.passingScore || 70) 
                                ? "Great job! You've successfully completed this quiz." 
                                : "Don't worry, you can review the material and try again."}
                            </p>
                            
                            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto mb-8">
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                                <div className="flex items-center justify-center gap-2">
                                  {/* <Progress value={quizScore} className="h-3 w-40" /> */}
                                  <span className="font-bold text-lg">{quizScore}%</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Passing Score</p>
                                  <p className="font-medium">{activeQuiz.passingScore}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Time Taken</p>
                                  <p className="font-medium">{activeQuiz.timeLimit - Math.floor(timeLeft / 60)} min</p>
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
                              
                              {quizScore >= (activeQuiz.passingScore || 70) && (
                                <Button>
                                  Continue to Next Chapter
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