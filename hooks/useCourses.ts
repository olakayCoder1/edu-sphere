import { useState, useCallback, useEffect } from 'react';
import courseService from '@/services/courseService';

interface Course {
  id: number;
  title: string;
  description: string;
  [key: string]: any;
}

interface CourseResponse {
  results?: Course[];
  [key: string]: any;
}

interface FetchError extends Error {
  response?: {
    data?: any;
    status?: number;
  };
}

type QueryParams = Record<string, any>;

/**
 * Hook for fetching multiple courses
 */
export function useCourses(initialParams: QueryParams = {}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [params, setParams] = useState<QueryParams>(initialParams);

  const fetchCourses = useCallback(async (queryParams: QueryParams = {}) => {
    setLoading(true);
    setError(null);

    const mergedParams = { ...params, ...queryParams };
    setParams(mergedParams);

    try {
      const data: CourseResponse = await courseService.getCourses(mergedParams);
      setCourses(Array.isArray(data.results) ? data.results : []);
      return data;
    } catch (err) {
      setError(err as FetchError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    setParams,
  };
}

/**
 * Hook for fetching a single course
 */
export function useCourse(courseId: string | number | null = null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);

  const fetchCourse = useCallback(async (id: string | number | null = courseId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data: Course = await courseService.getCourseById(id);
      setCourse(data);
      return data;
    } catch (err) {
      setError(err as FetchError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  return {
    course,
    loading,
    error,
    fetchCourse,
  };
}