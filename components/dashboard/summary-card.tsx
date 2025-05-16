import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  title: string;
  course_completion_rate: number;
  avg_lesson_completion_rate: number;
  enrolled_students: number;
  total_lessons: number;
}

interface CourseSummaryChartProps {
  courseSummary: Course[];
  loading?: boolean;
}

export default function CourseSummaryChart({ courseSummary, loading = false }: CourseSummaryChartProps) {
  const [chartData, setChartData] = useState<{ 
    name: string; 
    fullTitle: string; 
    completionRate: number; 
    avgLessonCompletion: number; 
    students: number; 
    lessons: number; 
  }[]>([]);
  
  useEffect(() => {
    if (courseSummary && courseSummary.length > 0) {
      // Transform the data for the chart
      const formattedData = courseSummary.map(course => ({
        name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
        fullTitle: course.title,
        completionRate: course.course_completion_rate,
        avgLessonCompletion: course.avg_lesson_completion_rate,
        students: course.enrolled_students,
        lessons: course.total_lessons
      }));
      
      setChartData(formattedData);
    }
  }, [courseSummary]);


  console.log(courseSummary)

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const course = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-4">
          <p className="font-semibold">{course.fullTitle}</p>
          <p className="text-sm">Students: {course.students}</p>
          <p className="text-sm">Total Lessons: {course.lessons}</p>
          <p className="text-sm">Avg. Lesson Completion: {course.avgLessonCompletion}%</p>
          <p className="text-sm">Course Completion: {course.completionRate}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>Summary of course engagement and completion metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="avgLessonCompletion" name="Lesson Completion %" fill="hsl(var(--chart-1))" />
                <Bar dataKey="completionRate" name="Course Completion %" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No course data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}