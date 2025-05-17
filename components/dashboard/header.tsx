"use client";

import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  UserPlus,
  FilePlus,
  Calendar
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification, User } from "@/lib/types";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { setTheme, theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for user in localStorage
    const storedUser = localStorage.getItem("eduSphereUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  // Function to handle quick actions based on user role
  const getQuickActions = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return [
          { label: 'Add User', icon: <UserPlus className="h-4 w-4 mr-2" />, href: '/dashboard/admin/users/new' }
        ];
      case 'tutor':
        return [
          { label: 'Create Course', icon: <FilePlus className="h-4 w-4 mr-2" />, href: '/dashboard/tutor/courses/new' },
          { label: 'Schedule Class', icon: <Calendar className="h-4 w-4 mr-2" />, href: '/dashboard/tutor/live-classes/new' }
        ];
      case 'student':
        return [];
      default:
        return [];
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="flex h-16 items-center px-4 md:px-6 ">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {/* <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-64 lg:w-72"
            />
          </div> */}
          
          {/* {getQuickActions().length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Quick Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {getQuickActions().map((action, i) => (
                  <DropdownMenuItem key={i} asChild>
                    <Link href={action.href} className="flex w-full cursor-pointer items-center">
                      {action.icon}
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" /> Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}