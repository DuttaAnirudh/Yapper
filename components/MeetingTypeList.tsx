"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

type MeetingType =
  | "isScheduleMeeting"
  | "isJoiningMeeting"
  | "isInstantMeeting"
  | undefined;

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingType>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const { toast } = useToast();
  const router = useRouter();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a Date and Time",
        });
        return;
      }

      const id = crypto.randomUUID();

      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting created Successfully ✅",
      });
    } catch (error) {
      console.log("Error:", error);
      toast({
        title: "Failed to Create A Meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-2 xl:flex xl:gap-6 2xl:gap-8">
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

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Schedule a Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-5">
            <label className="text-base font-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the  link here"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
