"use client";

import ErrorComponent from "@/components/custom/error-box";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeftCircle,
  Hash,
  Loader2Icon,
  Plus,
  SendHorizonal,
  Smile,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ChannelMessagingSectionSkeleton = () => (
  <div className="h-full w-full flex flex-col items-center justify-center">
    <Loader2Icon className="animate-spin" />
  </div>
);

export const ChannelMessagingSection = ({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) => {
  return (
    <Suspense fallback={<ChannelMessagingSectionSkeleton />}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <ChannelMessagingSectionSuspense
          channelId={channelId}
          serverId={serverId}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelMessagingSectionSuspense = ({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) => {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.channel.getOne.queryOptions({ serverId, channelId })
  );

  const channelName = data.name;

  const [message, setMessage] = useState("");

  return (
    <div className="h-full w-full flex-col items-center flex">
      <div className="w-full h-12 rounded-none bg-[#e5e5e5] dark:bg-[#2e2e2e] shadow z-1 px-4 flex gap-2 items-center">
        <ArrowLeftCircle
          onClick={() => router.push(`/server/${serverId}`)}
          className="mr-2"
        />
        <Hash size={22} />
        <p>{channelName}</p>
      </div>
      <div className="w-full flex-1 rounded-none bg-[#e5e5e5] dark:bg-[#2e2e2e] flex flex-col-reverse gap-2">
        <div className="flex items-center mx-2 sm:px-4 my-6 border rounded-md bg-muted">
          <button className="cursor-pointer bg-muted-foreground rounded-full ml-2 sm:ml-1">
            <Plus size={22} className="text-background" />
          </button>
          <div className="relative my-2 focus:outline-none flex-1 border-0 mx-2 flex items-center">
            <Input
              placeholder={`Message #${channelName}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {message && (
              <div
                className="absolute right-2 hover:bg-muted p-2 rounded-full"
                onClick={(e) => {
                  // Implement send functionality
                  // sendMessage(message);
                  e.stopPropagation();
                }}
              >
                <SendHorizonal size={16} />
              </div>
            )}
          </div>
          <button className="cursor-pointer rounded-full mr-2 sm:mr-1">
            <Smile />
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="w-20 h-20 p-2 rounded-full flex justify-center items-center bg-[#ececec] dark:bg-[#222222]">
            <Hash size={50} />
          </div>
          <div className="text-3xl font-bold">Welcome to #{channelName}</div>
          <div className="text-md text-muted-foreground">
            This is the start of #{channelName} channel
          </div>
        </div>
      </div>
    </div>
  );
};
