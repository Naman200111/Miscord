"use client";

import { ArrowLeftCircle, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";

const ChannelHeader = ({
  name,
  serverId,
}: {
  name: string;
  serverId: string;
}) => {
  const router = useRouter();
  const socketConnected = useSocket();

  return (
    <div className="flex flex-col w-full bg-[#e5e5e5] dark:bg-[#2e2e2e] z-1 sticky top-0">
      <div className="h-12 rounded-none px-4 flex gap-2 items-center shadow">
        <ArrowLeftCircle
          onClick={() => router.push(`/server/${serverId}`)}
          className="mr-2 flex-shrink-0"
        />
        <Hash size={22} className="flex-shrink-0" />
        <p className="line-clamp-1">{name}</p>
        <div
          className={cn(
            "ml-auto rounded-md px-3 hidden md:block",
            socketConnected ? "bg-emerald-700" : "bg-yellow-600",
          )}
        >
          <p className="text-white line-clamp-1">
            {socketConnected
              ? "Live: Real-time updates"
              : "Pending: Polling every 1sec"}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "p-1 mx-auto w-[100%] md:hidden text-center rounded-bl-md rounded-br-md",
          socketConnected ? "bg-emerald-700" : "bg-yellow-600",
        )}
      >
        <p className="text-clamp-1 text-white">
          {socketConnected
            ? "Live: Real-time updates"
            : "Pending: Polling every 1sec"}
        </p>
      </div>
    </div>
  );
};

export default ChannelHeader;
