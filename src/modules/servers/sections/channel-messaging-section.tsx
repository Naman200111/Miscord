"use client";

import ErrorComponent from "@/components/custom/error-box";
import Input from "@/components/custom/input";
import { Skeleton } from "@/components/custom/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftCircle, Hash, Plus, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ChannelMessagingSectionSkeleton = () => (
  <div className="h-full w-full flex flex-col items-center">
    <Skeleton className="w-full h-12 rounded-none bg-[#ebebeb] dark:bg-[#2e2e2e] shadow-2xl" />
    <Skeleton className="w-full flex-1 rounded-none bg-[#ebebeb] dark:bg-[#2e2e2e]" />
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
          <button className="cursor-pointer bg-muted-foreground rounded-full ml-2">
            <Plus size={22} className="text-background" />
          </button>
          <Input
            className="my-2 focus:outline-none flex-1 border-0"
            placeholder={`Message #${channelName}`}
          />
          <button className="cursor-pointer rounded-full mr-2">
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
