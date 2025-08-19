import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { channelRoles, messageData } from "@/types/types";
import {
  AlertTriangle,
  EditIcon,
  EllipsisVertical,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface MessageBoxProps {
  msgData: messageData;
  loggedInUser: string;
  loggedInUserRole: channelRoles;
}

const MessageBox = ({
  msgData,
  loggedInUser,
  loggedInUserRole,
}: MessageBoxProps) => {
  const {
    msg,
    state,
    updatedAt,
    imageUrl = "/user-placeholder.svg",
    role = "MEMBER",
    name,
    userId,
  } = msgData;

  const messageTime = updatedAt && new Date(updatedAt);
  const canEditMessage =
    userId === loggedInUser || loggedInUserRole === "ADMIN";

  return (
    <div className="w-full hover:bg-muted py-4 px-2 md:px-6 overflow-hidden">
      <div className="flex gap-3 w-full">
        <div className="min-w-10 h-10 relative overflow-hidden rounded-full mt-1">
          <Image src={imageUrl as string} alt="L" fill />
        </div>
        <div className="flex-1">
          <p className="flex gap-3 items-center">
            <span className="line-clamp-1 flex items-center gap-1">
              <span className="line-clamp-1">{name}</span>
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
        {canEditMessage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-inherit cursor-pointer outline-none"
              >
                <EllipsisVertical size={16} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <EditIcon size={16} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 size={16} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
