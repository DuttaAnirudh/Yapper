"use client";

import useGetCalls from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const router = useRouter();

  const { toast } = useToast();

  const {
    endedCalls,
    upcomingCalls,
    recordings: callRecordings,
    isLoading,
  } = useGetCalls();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;

      case "recordings":
        return recordings;

      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";

      case "recordings":
        return "No Recordings";

      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Unable to fetch Recordings. Please Try Again Later" });
      }
    };

    if (type === "recordings") {
      fetchRecording();
    }
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 20) ||
              (meeting as CallRecording)?.filename?.substring(0, 20) ||
              "No Description"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording)?.start_time.toLocaleString()
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            handleClick={
              type === "recordings"
                ? () => router.push(`/${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
