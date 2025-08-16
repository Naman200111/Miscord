import { cn } from "@/lib/utils";
import { messageData, User } from "@/types/types";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MessageBoxProps {
  msgData: messageData;
  currentUser: User;
}

const MessageBox = ({ msgData, currentUser }: MessageBoxProps) => {
  const { msg, state, updatedAt } = msgData;
  const { name, imageUrl = "/user-placeholder.svg" } = currentUser;

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
            <span className="line-clamp-1">{name}</span>
            {messageTime && (
              <span className="text-muted-foreground line-clamp-1 text-sm">
                {messageTime?.toLocaleString()}
              </span>
            )}
          </p>
          <p
            className={cn(state && state !== "success" ? "text-gray-400" : "")}
          >
            {msg}
            {state === "error" && (
              <span className="text-rose-500">
                <AlertTriangle size={16} />
                Failed !
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
