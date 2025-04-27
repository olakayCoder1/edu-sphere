"use client";

import { useEffect, useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { Header } from "@/components/dashboard/header";
import { LiveClassCard } from "@/components/dashboard/live-class-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Course, LiveClass } from "@/lib/types";
// import { DEMO_LIVE_CLASSES } from "@/lib/constants";


// Adjusted DEMO_LIVE_CLASSES to match the expected LiveClass type
const DEMO_LIVE_CLASSES: LiveClass[] = [
  {
    id: "class-1",
    title: "Introduction to React",
    course: "Web Development",
    tutor: "John Doe",
    date: "2023-11-25T10:00:00Z",
    duration: 120,
    status: "upcoming",
    attendees: 50,
    thumbnail: "/images/react-class.jpg",
  },
  {
    id: "class-2",
    title: "Advanced TypeScript",
    course: "Programming",
    tutor: "Jane Smith",
    date: "2023-11-20T14:00:00Z",
    duration: 90,
    status: "completed",
    attendees: 30,
    thumbnail: "/images/typescript-class.jpg",
    recording: "/recordings/typescript-class.mp4",
  },
];

export default function LiveClasses() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<LiveClass[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Load live classes
    setLiveClasses(DEMO_LIVE_CLASSES);
    setFilteredClasses(DEMO_LIVE_CLASSES);
  }, []);

  // Apply filters when search term or date changes
  useEffect(() => {
    let result = liveClasses;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        liveClass => 
          liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          liveClass.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          liveClass.tutor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (selectedDate) {
      result = result.filter(liveClass => {
        const classDate = new Date(liveClass.date);
        return (
          classDate.getFullYear() === selectedDate.getFullYear() &&
          classDate.getMonth() === selectedDate.getMonth() &&
          classDate.getDate() === selectedDate.getDate()
        );
      });
    }
    
    setFilteredClasses(result);
  }, [searchTerm, selectedDate, liveClasses]);

  // Group live classes by status
  const liveClassesByStatus = {
    upcoming: filteredClasses.filter(lc => lc.status === "upcoming"),
    live: filteredClasses.filter(lc => lc.status === "live"),
    completed: filteredClasses.filter(lc => lc.status === "completed"),
  };

  // Group upcoming classes by date
  const groupUpcomingClassesByDate = () => {
    const groups: { [key: string]: LiveClass[] } = {};
    
    liveClassesByStatus.upcoming.forEach(liveClass => {
      const date = new Date(liveClass.date);
      let dateKey = "";
      
      if (isToday(date)) {
        dateKey = "Today";
      } else if (isTomorrow(date)) {
        dateKey = "Tomorrow";
      } else {
        dateKey = format(date, "EEEE, MMMM d");
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(liveClass);
    });
    
    // Sort the keys by date
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === "Today") return -1;
        if (b === "Today") return 1;
        if (a === "Tomorrow") return -1;
        if (b === "Tomorrow") return 1;
        return 0;
      })
      .map(key => ({
        date: key,
        classes: groups[key]
      }));
  };

  const groupedUpcomingClasses = groupUpcomingClassesByDate();

  // Function to get dates with classes for the calendar
  const getClassDates = () => {
    return liveClasses.map(lc => new Date(lc.date));
  };

  return (
    <div>
      <Header title="Live Classes" />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search live classes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
                {selectedDate && (
                  <div className="p-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-center"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({liveClassesByStatus.upcoming.length + liveClassesByStatus.live.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({liveClassesByStatus.completed.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-8">
            {liveClassesByStatus.live.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-semibold">Live Now</h2>
                  <Badge className="ml-2 bg-red-500 text-white">LIVE</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {liveClassesByStatus.live.map((liveClass) => (
                    <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                  ))}
                </div>
              </div>
            )}
            
            {groupedUpcomingClasses.length > 0 ? (
              groupedUpcomingClasses.map((group, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-semibold mb-4">{group.date}</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {group.classes.map((liveClass) => (
                      <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              liveClassesByStatus.live.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No upcoming classes found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedDate
                      ? "Try adjusting your filters"
                      : "Check back later for new classes"}
                  </p>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {liveClassesByStatus.completed.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveClassesByStatus.completed.map((liveClass) => (
                  <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No completed classes found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedDate
                    ? "Try adjusting your filters"
                    : "You haven't attended any classes yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}