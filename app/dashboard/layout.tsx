// import { ReactNode } from "react";
// import { Sidebar } from "@/components/dashboard/sidebar";

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="min-h-screen bg-background flex">
//     {/* <div className="min-h-screen bg-background flex"> */}
//       <Sidebar />
//       <div className="lg:pl-64 w-screen">
//       {/* <div className="lg:pl-64"> */}
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import authService from "@/services/authService";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        console.log('Dashboard layout auth check:', { isAuthenticated });
        
        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to login');
          router.push('/auth/sign-in');
          return;
        }
        
        // Optional: Additional server-side validation
        try {
          await authService.getProfile();
          setIsAuthorized(true);
        } catch (profileError) {
          console.error('Profile validation error:', profileError);
          // If token is invalid, log out and redirect
          // authService.logout();
          // router.push('/auth/sign-in');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="lg:pl-64 w-full">
        {children}
      </div>
    </div>
  );
}