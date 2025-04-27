"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Demo notifications
    setNotifications([
      {
        id: "1",
        userId: "user-1",
        title: "New course available",
        message: "A new course on Advanced React has been published",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        link: "#"
      },
      {
        id: "2",
        userId: "user-1",
        title: "Quiz reminder",
        message: "Don't forget to complete the JavaScript Basics quiz",
        type: "warning",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "#"
      }
    ]);
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
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-64 lg:w-72"
            />
          </div>
          
          {getQuickActions().length > 0 && (
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
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Notifications</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto py-0 px-2 text-xs">
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 border-b cursor-pointer">
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <span className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full text-primary">
                    View all notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
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