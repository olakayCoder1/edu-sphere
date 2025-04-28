export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "tutor" | "student";
  avatar: string | null;
  createdAt?: string;
};

export type Admin = User & {
  role: "admin";
};

export type Tutor = User & {
  role: "tutor";
  expertise: string[];
  bio: string;
  courses?: Course[];
  rating?: number;
  students?: number;
};

export type Student = User & {
  role: "student";
  enrolledCourses: string[];
  completedCourses?: string[];
  progress?: {
    [courseId: string]: number;
  };
};

export type Course = {
  id: string;
  title: string;
  description: string;
  tutor: string; // tutor name or ID
  thumbnail: string;
  totalChapters: number;
  completedChapters?: number;
  progress?: number;
  // status?: string;
  status?: "not-started" | "in-progress" | "completed"| undefined;
  // category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  rating?: number;
  students?: number;
  lastAccessed?: string | null;
  chapters: Chapter[];
  createdAt?: string;
  updatedAt?: string;
};

export type Chapter = {
  id: string;
  title: string;
  isCompleted?: boolean;
  content?: string;
  quiz?: Quiz;
  duration?: number; // in minutes
};

export type Quiz = {
  id: string;
  title: string;
  courseId: string;
  chapterId: string;
  questions: Question[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
};

export type LiveClass = {
  id: string;
  title: string;
  course: string; // course title or ID
  tutor: string; // tutor name or ID
  date: string; // ISO date string
  duration: number; // in minutes
  status: "upcoming" | "live" | "completed";
  attendees: number;
  recording?: string; // URL to recording if completed
  thumbnail: string;
};

export type QuizResult = {
  quizId: string;
  studentId: string;
  score: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  completedAt: string;
};

export type Material = {
  id: string;
  title: string;
  courseId: string;
  chapterId?: string;
  type: "document" | "video" | "audio" | "presentation";
  url: string;
  uploadedBy: string; // tutor ID
  uploadedAt: string;
  size?: number; // in bytes
  duration?: number; // in seconds, for video/audio
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
};