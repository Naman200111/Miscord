"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";
import { Skeleton } from "@/components/custom/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChannelsSectionProps {
  serverId: string;
}

const ChannelsSkeleton = () => (
  <div className="h-full w-full sm:w-64 md:w-72 flex flex-col items-center">
    <Skeleton className="w-full h-full rounded-none bg-[#e2e2e2] dark:bg-[#2c2c2c]" />
  </div>
);

export const ChannelsSection = ({ serverId }: ChannelsSectionProps) => {
  return (
    <Suspense fallback={<ChannelsSkeleton />}>
      <ErrorBoundary fallback={<p>Oops...</p>}>
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

  const router = useRouter();

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
      />
      <Button onClick={() => router.push(`/server/${serverId}/channel/123`)}>
        Click
      </Button>
    </div>
  );
};
