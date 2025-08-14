"use client";

import { ArrowLeftCircle, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ChannelHeader = ({
  name,
  serverId,
}: {
  name: string;
  serverId: string;
}) => {
  const router = useRouter();

  const [socketConnected, setSocketConnected] = useState(false);

  const onConnect = () => {
    setSocketConnected(true);
  };
  const onDisconnect = () => {
    setSocketConnected(false);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#e5e5e5] dark:bg-[#2e2e2e] shadow z-1">
      <div className="h-12 rounded-none px-4 flex gap-2 items-center">
        <ArrowLeftCircle
          onClick={() => router.push(`/server/${serverId}`)}
          className="mr-2 flex-shrink-0"
        />
        <Hash size={22} className="flex-shrink-0" />
        <p>{name}</p>
        <div
          className={cn(
            "ml-auto rounded-md px-3 hidden sm:block",
            socketConnected ? "bg-emerald-700" : "bg-yellow-600"
          )}
        >
          <p>
            {socketConnected
              ? "Live: Real-time updates"
              : "Pending: Polling every 1sec"}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "p-1 w-full sm:hidden text-center",
          socketConnected ? "bg-emerald-700" : "bg-yellow-600"
        )}
      >
        {socketConnected ? (
          <p className="text-clamp-1">Live: Real-time updates</p>
        ) : (
          <p className="text-clamp-1">Pending: Polling every 1sec</p>
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
