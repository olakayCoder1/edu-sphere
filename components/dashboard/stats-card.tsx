"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  change,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {change && (
              <div className="flex items-center gap-1 mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  change.isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {change.isPositive ? "+" : ""}{change.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}