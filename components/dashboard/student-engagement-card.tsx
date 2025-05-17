import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import courseService from "@/services/courseService";

export default function StudentEngagementChart() {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    fetchOverallStats();
  }, []);
  
  const fetchOverallStats = async () => {
    try {
      setLoading(true);
      const response = await courseService.getOverrallSummary();
      setOverallStats(response);
      console.log("Overall stats:", response);
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate chart data based on overall stats
  const prepareChartData = () => {
    if (!overallStats || !overallStats.most_completed_lesson) return [];
    
    // For course engagement pie chart
    const pieData = [
      { name: 'Completed', value: overallStats.total_lesson_completions },
      { name: 'Remaining', value: overallStats.total_lessons * overallStats.total_students - overallStats.total_lesson_completions }
    ];
    
    // For most/least completed lessons
    const lessonCompletionData = [];
    if (overallStats.most_completed_lesson) {
      lessonCompletionData.push({
        name: overallStats.most_completed_lesson.title.length > 20 
          ? overallStats.most_completed_lesson.title.substring(0, 20) + '...' 
          : overallStats.most_completed_lesson.title,
        completions: overallStats.most_completed_lesson.completion_count,
        type: 'Popular'
      });
    }
    
    if (overallStats.least_completed_lesson) {
      lessonCompletionData.push({
        name: overallStats.least_completed_lesson.title.length > 20 
          ? overallStats.least_completed_lesson.title.substring(0, 20) + '...' 
          : overallStats.least_completed_lesson.title,
        completions: overallStats.least_completed_lesson.completion_count,
        type: 'Least Completed'
      });
    }
    
    // Return the data needed based on active tab
    if (activeTab === "overview") {
      return pieData;
    } else {
      return lessonCompletionData;
    }
  };
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
  
  const renderEngagementChart = () => {
    const chartData = prepareChartData();
    
    if (activeTab === "overview") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="completions"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1) / 0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>Analysis of student activity across courses</CardDescription>
          </div>
          <Tabs defaultValue="overview" className="w-[200px]" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-72 w-full rounded-md" />
          </div>
        ) : overallStats ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="border rounded-md p-3 text-center">
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="text-2xl font-bold">{overallStats.total_students}</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-sm text-muted-foreground">Total Courses</div>
                <div className="text-2xl font-bold">{overallStats.total_courses}</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-sm text-muted-foreground">Avg. Completions</div>
                <div className="text-2xl font-bold">{overallStats.avg_completions_per_student}</div>
              </div>
            </div>
            
            <div className="h-72">
              {renderEngagementChart()}
            </div>
            
            {activeTab === "overview" && overallStats.most_engaging_course && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50">
                <div className="text-sm text-muted-foreground">Most Engaging Course</div>
                <div className="font-medium">{overallStats.most_engaging_course.title}</div>
                <div className="text-sm">{overallStats.most_engaging_course.engagement_score}% engagement</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No engagement data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}