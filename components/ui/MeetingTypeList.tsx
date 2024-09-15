"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";

type MeetingType =
  | "isScheduleMeeting"
  | "isJoiningMeeting"
  | "isInstantMeeting"
  | undefined;

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingType>();

  const router = useRouter();
  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        imgUrl="/icons/add-meeting.svg"
        color="bg-orange-1"
        title="New Meeting"
        description="Start an Instant Meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        imgUrl="/icons/recordings.svg"
        color="bg-blue-1"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        imgUrl="/icons/schedule.svg"
        color="bg-purple-1"
        title="Schedule Meeting"
        description="Plan your upcoming meetings"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        imgUrl="/icons/recordings.svg"
        color="bg-yellow-1"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
      />
    </section>
  );
};

export default MeetingTypeList;
