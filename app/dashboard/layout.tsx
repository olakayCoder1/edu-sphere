import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
    {/* <div className="min-h-screen bg-background flex"> */}
      <Sidebar />
      <div className="lg:pl-64">
      {/* <div className="lg:pl-64"> */}
        {children}
      </div>
    </div>
  );
}