import api from '@/lib/api';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  description: string;
  [key: string]: any;
  data?: any
}

interface CourseParams {
  [key: string]: any;
}

interface CourseData {
  title: string;
  description: string;
  [key: string]: any;
}

export const courseService = {
  /**
   * Get all courses
   */
  getCourses: async (params: CourseParams = {}): Promise<any> => {
    try {
      const response = await api.get<{
        data: Course[]
      }>('/courses/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },



  getAllCourses: async (params: CourseParams = {}): Promise<any> => {
    try {
      const response = await api.get<{
        data: Course[]
      }>('/courses/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },



  getTutors: async (params: CourseParams = {}): Promise<any> => {
    try {
      const response = await api.get<{
        data: Course[]
      }>('/courses/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },

  exportCourseData: async (courseId: string | number) => {
    // Example implementation: adjust URL and logic as needed
    const response = await fetch(`/api/courses/${courseId}/export`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to export course data");
    // Optionally handle file download here
    return response;
  },



  getCoursesSummary: async (params: CourseParams = {}): Promise<Course[]> => {
    try {
      const response = await api.get<Course[]>('/analytics/lesson-completion/course_summary/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },


  getOverrallSummary: async (params: CourseParams = {}): Promise<Course[]> => {
    try {
      const response = await api.get<Course[]>('/analytics/lesson-completion/overall_stats/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },


  /**
   * Get all courses
   */
  getInProgressCourses: async (params: CourseParams = {}): Promise<{
    data: Course[]
  }> => {
    try {
      const response = await api.get<{
        data: Course[]
      }>('/courses/in-progress/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },



  /**
   * Get course by ID
   */
  getCourseById: async (courseId: string | number): Promise<Course> => {
    try {
      const response = await api.get<Course>(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch course details');
      throw error;
    }
  },

  /**
   * Create new course
   */
  createCourse: async (courseData: CourseData): Promise<Course> => {
    try {
      const response = await api.post<Course>('/courses/', courseData);
      toast.success('Course created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create course');
      throw error;
    }
  },


  createCourseForm: async (courseData: any): Promise<Course> => {
    try {
      // const formData = new FormData();
      // formData.append("title", courseData.title);
      // formData.append("description", courseData.description);
      // formData.append("file", courseData.file); // assuming your backend expects the file field to be called 'file'

      const response = await api.post<Course>("/courses/upload/", courseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course created successfully");
      return response.data;
    } catch (error) {
      // toast.error("Failed to create course");
      throw error;
    }
  },

  /**
   * Update course
   */
  updateCourse: async (courseId: string | number, courseData: CourseData): Promise<Course> => {
    try {
      const response = await api.patch<Course>(`/courses/${courseId}/`, courseData);
      toast.success('Course updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update course');
      throw error;
    }
  },

  /**
   * Delete course
   */
  deleteCourse: async (courseId: string | number): Promise<boolean> => {
    try {
      await api.delete(`/courses/${courseId}/`);
      toast.success('Course deleted');
      return true;
    } catch (error) {
      toast.error('Failed to delete course');
      throw error;
    }
  },

  /**
   * Enroll student in course
   */
  enrollInCourse: async (courseId: string | number): Promise<any> => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll/`);
      toast.success('Successfully enrolled in course');
      return response.data;
    } catch (error) {
      toast.error('Failed to enroll in course');
      throw error;
    }
  },

  /**
   * Get course materials
   */
  getCourseMaterials: async (courseId: string | number): Promise<any> => {
    try {
      const response = await api.get(`/courses/${courseId}/materials/`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch course materials');
      throw error;
    }
  },


  async completeLesson(courseId: any, lessonId: any) {
    try {
      const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update quiz results - could be implemented if needed
  async submitQuizResults(courseId: any, lessonId: any, quizId: any, answers: any, score: any) {
    try {
      const response = await api.post( `/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submit/`,
        {
          answers,
          score
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}



  /**
   * Upload course material
   */
  uploadCourseMaterial: async (courseId: string | number, formData: FormData): Promise<any> => {
    try {
      const response = await api.post(`/courses/${courseId}/materials/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Material uploaded successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to upload material');
      throw error;
    }
  
};




export default courseService;
