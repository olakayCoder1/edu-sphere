"use client";

import { useEffect, useState } from "react";
import CourseDetail from "./detail";
import courseService from "@/services/courseService";

import { useParams } from "next/navigation";
import { Course } from "@/lib/types";

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response : any = await courseService.getCourseById(courseId as string);
        setCourse(response);
        console.log(response)
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (!course) return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Loading course...</p>
    </div>
  );

  return <CourseDetail courseData={course} />;
}
