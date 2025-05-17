// userService.ts - API service for user management operations
import api from '@/lib/api';
import { toast } from 'sonner';

// Interface definitions based on the backend models
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  app_level_role: string;
  is_active: boolean;
  is_verify: boolean;
  created_at: string;
  updated_at?: string;
  [key: string]: any;
}


type Student = {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  lastActive?: string;
  coursesEnrolled: number;
  progress: number;
  status: 'active' | 'inactive' | 'completed';
  grade?: string;
  profileImage?: string;
  courses: {
    id: string;
    name: string;
    progress: number;
    lastAccessed?: string;
  }[];
};

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserStatsResponse {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  students: {
    total: number;
    active: number;
    pending: number;
  };
  tutors: {
    total: number;
    active: number;
    pending: number;
  };
  admins: {
    total: number;
  };
}

export interface BulkActionResponse {
  status: boolean;
  message: string;
  updated_count: number;
  failed_ids: string[];
}

export interface UserResponse {
  status: boolean;
  message: string;
  user?: User;
}

/**
 * Service to handle all user management API calls
 */
export const UserService = {
  /**
   * Get all users with optional filtering
   */
  getAllUsers: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role);
      }
      
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.page_size) {
        params.append('page_size', filters.page_size.toString());
      }
      
      const queryString = params.toString();
      const url = `/users/${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },


  getStudents: async (params: any = {}): Promise<Student[]> => {
    try {
      const response = await api.get<Student[]>('/students/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },


  getAllUsersAll: async (params: any = {}): Promise<Student[]> => {
    try {
      const response = await api.get<Student[]>('/users/', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch courses');
      throw error;
    }
  },

  /**
   * Get user details by ID
   */
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: Partial<User>): Promise<UserResponse> => {
    try {
      const response = await api.post('/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   */
  updateUser: async (userId: string, userData: Partial<User>): Promise<UserResponse> => {
    try {
      const response = await api.put(`/users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Delete user by ID
   */
  deleteUser: async (userId: string): Promise<UserResponse> => {
    try {
      const response = await api.delete(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Update user status (approve, reject, deactivate)
   */
  updateUserStatus: async (userId: string, status: string): Promise<UserResponse> => {
    try {
      const response = await api.patch(`/users/${userId}/update_status/`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Bulk update status for multiple users
   */
  bulkUpdateStatus: async (userIds: string[], status: string): Promise<BulkActionResponse> => {
    try {
      const response = await api.post('/users/bulk_update_status/', {
        user_ids: userIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk status update:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<UserStatsResponse> => {
    try {
      const response = await api.get('/users/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * Approve all pending users
   */
  approveAllPending: async (): Promise<BulkActionResponse> => {
    try {
      const response = await api.post('/users/approve_all_pending/');
      return response.data;
    } catch (error) {
      console.error('Error approving all pending users:', error);
      throw error;
    }
  },

  /**
   * Deactivate inactive users (60+ days)
   */
  deactivateInactiveUsers: async (): Promise<BulkActionResponse> => {
    try {
      const response = await api.post('/users/deactivate_inactive/');
      return response.data;
    } catch (error) {
      console.error('Error deactivating inactive users:', error);
      throw error;
    }
  },

  /**
   * Export users as CSV
   */
  exportUsersCSV: async (filters: UserFilters = {}): Promise<Blob> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role);
      }
      
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const queryString = params.toString();
      const url = `/users/export_csv/${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting users to CSV:', error);
      throw error;
    }
  },

  /**
   * Format user data for frontend display
   */
  formatUserForFrontend: (user: User): any => {
    let status = 'pending';
    if (user.is_verify && user.is_active) {
      status = 'approved';
    } else if (!user.is_active) {
      status = 'inactive';
    }
    
    const name = user.first_name || user.last_name 
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : user.email.split('@')[0];
    
    return {
      id: user.id,
      name,
      email: user.email,
      role: user.app_level_role,
      status,
      registeredAt: user.created_at,
      lastActive: user.updated_at,
      // Additional fields as needed
    };
  },

    // Get dashboard statistics (total students, tutors, courses)
  getStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get user registration data for charts
  getUserRegistrations: async () => {
    try {
      const response = await api.get('/admin/dashboard/registrations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      throw error;
    }
  },

  // Get active users data for charts
  getActiveUsers: async () => {
    try {
      const response = await api.get('/admin/dashboard/active-users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  },



};




export default UserService;


