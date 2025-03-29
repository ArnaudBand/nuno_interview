import Image from "next/image";
import { AgentProps } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

export const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.CONNECTING;
  const isSpeaking = true;

  const messages = [
    "What`s Your Name?",
    "My Name is John Doe, Nice To Meet You!",
  ];

  const lastMessages = messages[messages.length - 1];
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
              key={lastMessages}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessages}
            </p>
          </div>
        </div>
      )}
      <div className={"w-full flex justify-center"}>
        {callStatus !== CallStatus.ACTIVE ? (
          <Button className={"relative btn-call"}>
            <span
              className={cn(
                `absolute animate-ping rounded-full opacity-75, ${
                  callStatus === CallStatus.CONNECTING
                } & hidden`
              )}
            />
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? "Call"
                : "...."}
            </span>
          </Button>
        ) : (
          <Button className={"btn-disconnect"}>End</Button>
        )}
      </div>
    </>
  );
};
