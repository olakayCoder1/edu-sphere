"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow, isPast, isToday, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveClass } from "@/lib/types";
import { Play, CalendarCheck, Video } from "lucide-react";
import Image from "next/image";
interface LiveClassCardProps {
  liveClass: LiveClass;
}

export function LiveClassCard({ liveClass }: LiveClassCardProps) {
  const date = new Date(liveClass.date);
  const isPastClass = isPast(date);
  
  // Format date for display
  const formatDate = () => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };
  
  // Get relative time from now
  const getRelativeTime = () => {
    if (isPastClass) {
      return `${formatDistanceToNow(date)} ago`;
    } else {
      return `in ${formatDistanceToNow(date)}`;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <Image 
            src={liveClass.thumbnail} 
            alt={liveClass.title}
            className="w-full aspect-video object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={
              liveClass.status === "live" 
                ? "bg-red-500 text-white" 
                : liveClass.status === "upcoming" 
                  ? "bg-blue-500 text-white" 
                  : "bg-green-500 text-white"
            }>
              {liveClass.status === "live" 
                ? "LIVE NOW" 
                : liveClass.status === "upcoming" 
                  ? "Upcoming" 
                  : "Completed"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg mb-1">{liveClass.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{liveClass.course}</p>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarCheck className="h-4 w-4 mr-1" />
            <span>{formatDate()}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="flex items-center">
              <span className="font-medium">Duration:</span>
              <span className="ml-1 text-muted-foreground">{liveClass.duration} mins</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Attendees:</span>
              <span className="ml-1 text-muted-foreground">{liveClass.attendees}</span>
            </div>
          </div>
          
          <div className="mt-4 flex-grow flex items-end">
            {liveClass.status === "live" ? (
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" /> Join Now
              </Button>
            ) : liveClass.status === "upcoming" ? (
              <div className="w-full text-center">
                <Button variant="outline" className="w-full">Add to Calendar</Button>
                <p className="text-xs text-muted-foreground mt-2">Starting {getRelativeTime()}</p>
              </div>
            ) : (
              <Button variant="outline" className="w-full gap-2">
                <Video className="h-4 w-4" /> Watch Recording
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}