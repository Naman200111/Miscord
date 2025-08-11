"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import ErrorComponent from "@/components/custom/error-box";

interface ChannelsSectionProps {
  serverId: string;
}

const ChannelsSkeleton = () => (
  <div className="h-full w-full sm:w-64 md:w-72 flex flex-col items-center justify-center bg-[#ececec] dark:bg-[#222222]">
    <Loader2Icon className="animate-spin" />
  </div>
);

export const ChannelsSection = ({ serverId }: ChannelsSectionProps) => {
  return (
    <Suspense fallback={<ChannelsSkeleton />}>
      <ErrorBoundary
        fallback={
          <ErrorComponent message="You are no longer a part of this server" />
        }
      >
        <ChannelsSectionSuspense serverId={serverId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelsSectionSuspense = ({ serverId }: ChannelsSectionProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.server.getOne.queryOptions({ serverId })
  );

  // const { data: channels } = useSuspenseQuery(
  //   trpc.channel.getMany.queryOptions({ serverId })
  // );

  // const router = useRouter();

  // to conditionally show pages
  const path = usePathname();
  const hasChannel = path.includes("channel");

  return (
    <div
      className={cn(
        "h-full w-full sm:w-64 md:w-72 flex flex-col gap-2 bg-[#ececec] dark:bg-[#222222] items-center",
        hasChannel ? "hidden sm:flex" : ""
      )}
    >
      <ServerHeader
        name={data.server.name || "Server name"}
        role={data.role}
        serverId={serverId}
        serverImageUrl={data.server.imageUrl}
        serverImageKey={data.server.imageKey}
        inviteCode={data.server.inviteCode}
        userId={data.userId}
      />

      {/* <div className="h-[1px] bg-blue w-full"></div> */}

      {/* Create channels ui */}
      {/* {JSON.stringify(channels)} */}

      {/* <Button onClick={() => router.push(`/server/${serverId}/channel/123`)}>
        Click
      </Button> */}
    </div>
  );
};
