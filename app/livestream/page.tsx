"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import authService from "@/services/authService";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import { Loader2 } from "lucide-react";

function randomID(len = 5): string {
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getUrlParams(url = ""): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(url ? new URL(url).search : window.location.search);
}

export default function MeetingPage() {
  const searchParams = useSearchParams();
  const meetingRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const startMeeting = async () => {
      if (!meetingRef.current || typeof window === "undefined") return;

      // Dynamically import ZegoUIKitPrebuilt (SSR-safe)
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

      const urlParams = getUrlParams();
      const roomID = urlParams.get("roomID") || randomID();
      const roleStr = urlParams.get("role") || "Host";

      const role =
        roleStr === "Host"
          ? ZegoUIKitPrebuilt.Host
          : roleStr === "Cohost"
          ? ZegoUIKitPrebuilt.Cohost
          : ZegoUIKitPrebuilt.Audience;

      const sharedLinks = [];

      if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
        sharedLinks.push({
          name: "Join as co-host",
          url: `${window.location.origin}${window.location.pathname}?roomID=${roomID}&role=Cohost`,
        });
      }

      sharedLinks.push({
        name: "Join as audience",
        url: `${window.location.origin}${window.location.pathname}?roomID=${roomID}&role=Audience`,
      });

      // Add your real appID and serverSecret here
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0", 10);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(),
        randomID()
      );

      console.log(kitToken)

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
        sharedLinks,
      });
    };

    startMeeting();
  }, [searchParams]);

    // useEffect(() => {
    //     fetchProfileData();
    //   }, [searchParams]);

//   const fetchProfileData = async () => {
//     try {
//       setIsFetching(true);
//       const response = await authService.getProfile();
      
//       // Extract profile data from response
//       const userData = response.data.data || {};
      
//       // Update profile state with actual data
//       setProfile(userData);
      
//       setIsFetching(false);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//       toast.error("Failed to load profile data. Please try again.");
//       setIsFetching(false);
//     }
//   };


    if (isFetching) {
    return (
      <div>
        <Header title="Loading..." />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

//   return (<div>{profile?.name}</div>)

  return (
    <div
      ref={meetingRef}
      className="myCallContainer"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
