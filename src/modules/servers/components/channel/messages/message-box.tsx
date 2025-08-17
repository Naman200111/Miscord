import { cn } from "@/lib/utils";
import { messageData } from "@/types/types";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MessageBoxProps {
  msgData: messageData;
}

const MessageBox = ({ msgData }: MessageBoxProps) => {
  const {
    msg,
    state,
    updatedAt,
    imageUrl = "/user-placeholder.svg",
    role = "MEMBER",
    name,
  } = msgData;

  // TODO: here need current user and user who sent the message
  const messageTime = updatedAt && new Date(updatedAt);

  return (
    <div className="w-full hover:bg-muted py-4 px-2 overflow-hidden">
      <div className="flex gap-3 w-full">
        <div className="min-w-10 h-10 relative overflow-hidden rounded-full mt-1">
          <Image src={imageUrl as string} alt="L" fill />
        </div>
        <div>
          <p className="flex gap-3 items-center">
            <span className="line-clamp-1 flex items-center gap-1">
              {name}
              {role === "ADMIN" ? (
                <ShieldCheck size={18} className="text-rose-400" />
              ) : role === "MODERATOR" ? (
                <ShieldAlert size={18} className="text-indigo-400" />
              ) : (
                <></>
              )}
            </span>

            {messageTime && (
              <span className="text-muted-foreground line-clamp-1 text-sm">
                {messageTime?.toLocaleString()}
              </span>
            )}
            {state === "error" && (
              <span className="text-rose-500 flex gap-1 items-center text-xs p-1 rounded-md bg-muted">
                <AlertTriangle size={12} />
                Failed !
              </span>
            )}
          </p>
          <p
            className={cn(state && state !== "success" ? "text-gray-400" : "")}
          >
            {msg}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
