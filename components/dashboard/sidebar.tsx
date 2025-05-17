"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Video, 
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  LineChart,
  Award,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { DASHBOARD_LINKS } from "@/lib/constants";
import { User } from "@/lib/types";
import { UrlObject } from "node:url";
import authService from "@/services/authService";
interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for user in localStorage (in a real app, this would be handled by auth state management)
    const storedUser = localStorage.getItem("eduSphereUser");
    if (storedUser) {
      const storedData = JSON.parse(storedUser)
      setUser(storedData?.user);
    }
  }, []);



  // Get the appropriate links based on user role
  const getLinks = () => {
    if (!user) return [];
    
    // Convert icon strings to actual components
    const getIcon = (iconName: string) => {
      const icons: { [key: string]: React.ReactNode } = {
        LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
        BookOpen: <BookOpen className="h-5 w-5" />,
        Users: <Users className="h-5 w-5" />,
        Video: <Video className="h-5 w-5" />,
        BarChart3: <BarChart3 className="h-5 w-5" />,
        Settings: <Settings className="h-5 w-5" />,
        GraduationCap: <GraduationCap className="h-5 w-5" />,
        LineChart: <LineChart className="h-5 w-5" />,
        Award: <Award className="h-5 w-5" />,
      };
      return icons[iconName] || <LayoutDashboard className="h-5 w-5" />;
    };

    return (DASHBOARD_LINKS as any)[user?.role]?.map((link: any) => ({
      ...link,
      icon: getIcon(link.icon),
    }));
  };

  const links = getLinks();
  console.log(links)

  const handleLogout = async () => {
    // localStorage.removeItem("eduSphereUser");
    await authService.logout();
    window.location.href = "/auth/sign-in";
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">EduSphere</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar (Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background border-r shadow-lg">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">EduSphere</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto py-4 px-3">
                <nav className="flex flex-col space-y-1">
                    {links?.map((link: { href: string | UrlObject; icon: ReactNode; label: ReactNode }, index: number) => (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <span
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === link.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                      )}
                      >
                      {link.icon}
                      {link.label}
                      </span>
                    </Link>
                    ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex fixed top-0 bottom-0 lg:flex-col h-screen w-64 border-r bg-background",
          // "hidden lg:flex lg:flex-col h-screen w-64 border-r bg-background",
          className
        )}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EduSphere</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2 px-4">
          <nav className="flex flex-col space-y-1">
            {links?.map((link: { href: string | UrlObject; icon: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
              <Link key={index} href={link.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {user?.first_name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium line-clamp-1">{user?.email || "User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || "Role"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}