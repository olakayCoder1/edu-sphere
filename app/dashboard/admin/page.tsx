"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Admin } from "@/lib/types";
import userService from "@/services/userService";
import {
  BookOpen,
  Users, GraduationCap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { toast } from "sonner";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_students: { value: 0, change: { value: 0, isPositive: true } },
    total_tutors: { value: 0, change: { value: 0, isPositive: true } },
    total_courses: { value: 0, change: { value: 0, isPositive: true } }
  });
  const [registrationData, setRegistrationData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    // Check for user info in localStorage
    const storedUser = localStorage.getItem("eduSphereUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        setAdmin(user as Admin);
      }
    }

    // Fetch all dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [statsData, registrations, activeUsers] = await Promise.all([
        userService.getStats(),
        userService.getUserRegistrations(),
        userService.getActiveUsers()
      ]);

      // Update state with fetched data
      setStats(statsData);
      setRegistrationData(registrations);
      setEngagementData(activeUsers);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Admin Dashboard" />
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Students"
                value={stats.total_students.value}
                icon={<GraduationCap className="h-5 w-5" />}
                change={stats.total_students.change}
              />
              <StatsCard
                title="Total Tutors"
                value={stats.total_tutors.value}
                icon={<Users className="h-5 w-5" />}
                change={stats.total_tutors.change}
              />
              <StatsCard
                title="Total Courses"
                value={stats.total_courses.value}
                icon={<BookOpen className="h-5 w-5" />}
                change={stats.total_courses.change}
              />
            </div>

            <div className="mt-8 grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Registrations</CardTitle>
                  <CardDescription>Monthly registration trends for students and tutors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={registrationData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="students" 
                          name="Students" 
                          fill="hsl(var(--chart-1))" 
                        />
                        <Bar 
                          dataKey="tutors" 
                          name="Tutors" 
                          fill="hsl(var(--chart-2))" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
