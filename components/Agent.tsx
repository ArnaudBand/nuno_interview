/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { AgentProps } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi-sdk";
import { createFeedback } from "@/lib/actions/general.actions";
import { env } from "@/env";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export const Agent = ({ userName, userId, type, interviewId, feedbackId }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string>('');

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMesaage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMesaage]);
      }
    };


    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log('Error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    await vapi.start(env.vapi.workflow, {
      variableValues: {
        username: userName,
        userid: userId
      }
    })
  };

  const handleEnd = async () => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || CallStatus.FINISHED;
  
  return (
    <>
      <div className={`call-view`}>
        <div className={`card-interviewer`}>
          <div className={`avatar`}>
            <Image
              src={"/ai-avatar.png"}
              alt={"Avatar"}
              width={65}
              height={54}
              className={"object-cover"}
            />
            {isSpeaking && <span className={"animate-speak"}></span>}
          </div>
          <h3 className={"text-center"}>AI Interviewer</h3>
        </div>
        <div className={"card-border"}>
          <div className={`card-content`}>
            <Image
              src="/user-avatar.png"
              alt={"User Avatar"}
              width={540}
              height={540}
              className={"rounded-full object-cover size-[120px]"}
            />
            <h3 className={"text-center"}>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className={"transcript-border"}>
          <div className={"transcript"}>
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className={"w-full flex justify-center"}>
        {callStatus !== CallStatus.ACTIVE ? (
          <Button className={"relative btn-call bg-green-600"} onClick={handleCall}>
            <span
              className={cn(
                `absolute animate-ping rounded-full opacity-75, ${
                  callStatus === CallStatus.CONNECTING
                } & hidden`
              )}
            />
            <span>
              {isCallInactiveOrFinished
                ? "Call"
                : "...."}
            </span>
          </Button>
        ) : (
          <Button className={"btn-disconnect"} onClick={handleEnd}>End</Button>
        )}
      </div>
    </>
  );
};
