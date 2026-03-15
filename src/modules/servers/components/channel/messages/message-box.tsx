import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { channelRoles, messageData } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  EditIcon,
  EllipsisVertical,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
    id,
  } = msgData;

  const [message, setMessage] = useState(msg);
  const [isDeleted, setIsDeleted] = useState(msgData.isDeleted);
  const [isEditing, setIsEditing] = useState(false);

  const trpc = useTRPC();

  const deleteMessage = useMutation(
    trpc.message.delete.mutationOptions({
      onSuccess: (data) => {
        setMessage(data.msg);
        setIsDeleted(true);
        toast.message("Message deleted");
      },
      onError: () => {
        toast.message("Failed to delete message");
      },
    }),
  );

  useEffect(() => {
    setMessage(msgData.msg);
    setIsDeleted(msgData.isDeleted);
  }, [msgData]);

  const isEdited =
    msgData.updatedAt &&
    msgData.createdAt &&
    new Date(msgData.updatedAt) > new Date(msgData.createdAt);

  const messageTime = updatedAt && new Date(updatedAt);
  const canEditMessage = userId === loggedInUser;
  const canDeleteMessage =
    userId === loggedInUser || loggedInUserRole === "ADMIN";

  const onEditSave = () => {
    if (message === "") return;
    socket.emit(`chat:message`, { ...msgData, msg: message });
    setIsEditing(false);
  };

  return (
    <div className="w-full hover:bg-muted py-4 px-2 md:px-6 overflow-hidden">
      <div className="flex gap-3 w-full">
        <div className="min-w-10 h-10 relative overflow-hidden rounded-full mt-1">
          <Image src={imageUrl as string} alt="L" fill />
        </div>
        <div className="flex-1">
          <p className="flex flex-col mb-2 md:m-0 md:gap-3 md:flex-row md:items-center">
            <span className="line-clamp-1 flex items-center gap-1">
              <span className="line-clamp-1">{name}</span>
              {role === "ADMIN" ? (
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldCheck size={18} className="text-rose-400" />
                  </TooltipTrigger>
                  <TooltipContent>Admin</TooltipContent>
                </Tooltip>
              ) : role === "MODERATOR" ? (
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldAlert size={18} className="text-indigo-400" />
                  </TooltipTrigger>
                  <TooltipContent>Moderator</TooltipContent>
                </Tooltip>
              ) : (
                <></>
              )}
            </span>

            {messageTime && (
              <span
                className="text-muted-foreground line-clamp-1 text-xs"
                suppressHydrationWarning={true}
              >
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
          {!isEditing && (
            <p
              className={cn(
                state && state !== "success" ? "text-gray-400" : "",
              )}
            >
              {isDeleted ? (
                <span className="text-muted-foreground">{message}</span>
              ) : (
                <span>{message}</span>
              )}
              {isEdited && !isDeleted && (
                <span className="text-muted-foreground text-sm">
                  {" "}
                  (edited){" "}
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <div className="w-full flex justify-between gap-2 mt-2">
              <div className="relative w-full">
                <Input
                  value={message}
                  className="bg-accent"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "enter") {
                      e.stopPropagation();
                      e.preventDefault();
                      onEditSave();
                    }
                  }}
                />
                <div
                  className="absolute bg-rose-500 rounded-full p-[3px] top-[-6px] right-[-4px]"
                  onClick={() => {
                    setIsEditing(false);
                    setMessage(msg);
                  }}
                >
                  <X size={12} className="text-white" />
                </div>
              </div>
              <Button
                className="bg-indigo-400 text-foreground hover:bg-indigo-400 cursor-pointer"
                onClick={onEditSave}
              >
                Save
              </Button>
            </div>
          )}
        </div>
        {!isDeleted && canDeleteMessage && (
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
              {canEditMessage && (
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <EditIcon size={16} /> Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => deleteMessage.mutate({ id })}
                disabled={deleteMessage.isPending}
              >
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
