// /dashboard/student/courses/[courseId]/page.tsx
import { Course, LiveClass } from "@/lib/types";
import CourseDetail from "./detail"

// DEMO_COURSES should be available here or imported from constants
// import { DEMO_COURSES } from "@/lib/constants";



const DEMO_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Programming",
    description: "Learn the basics of programming.",
    tutor: "John Doe",
    thumbnail: "/images/programming-course.jpg",
    totalChapters: 10,
    completedChapters: 5,
    progress: 50,
    status: "in-progress",
    category: "Programming",
    level: "Beginner",
    students: 120,
    duration: "120",
    chapters: [],
  },
  {
    id: "course-2",
    title: "Advanced React",
    description: "Master React with advanced concepts.",
    tutor: "Jane Smith",
    thumbnail: "/images/react-course.jpg",
    totalChapters: 15,
    completedChapters: 15,
    progress: 100,
    status: "completed",
    category: "Web Development",
    level: "Advanced",
    students: 80,
    duration: "180",
    chapters: [],
  },
];




export async function generateStaticParams() {
  return DEMO_COURSES.map((course) => ({
    courseId: course.id,
  }));
}

export default function CoursePage() {
  return <CourseDetail />;
}
