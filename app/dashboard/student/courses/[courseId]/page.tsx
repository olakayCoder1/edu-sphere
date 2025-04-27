// /dashboard/student/courses/[courseId]/page.tsx
import CourseDetail from "./detail"

// DEMO_COURSES should be available here or imported from constants
import { DEMO_COURSES } from "@/lib/constants";

export async function generateStaticParams() {
  return DEMO_COURSES.map((course) => ({
    courseId: course.id,
  }));
}

export default function CoursePage() {
  return <CourseDetail />;
}
