"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";
import { Skeleton } from "@/components/custom/skeleton";

interface ServerDetailsSectionProps {
  serverId: string;
}

const ServerDetailsSkeleton = () => (
  <div className="h-full w-60 flex flex-col items-center">
    <Skeleton className="w-full h-full rounded-none bg-[#ebebeb] dark:bg-[#3b3b3b]" />
  </div>
);

export const ServerDetailsSection = ({
  serverId,
}: ServerDetailsSectionProps) => {
  return (
    <Suspense fallback={<ServerDetailsSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ServerDetailsSectionSuspense serverId={serverId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ServerDetailsSectionSuspense = ({
  serverId,
}: ServerDetailsSectionProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.server.getOne.queryOptions({ serverId })
  );

  return (
    <div className="h-full w-60 flex flex-col gap-2 bg-[#ebebeb] dark:bg-[#222222] items-center">
      <ServerHeader
        name={data.server.name || "Server name"}
        role={data.role}
        serverId={serverId}
        serverImageUrl={data.server.imageUrl}
        serverImageKey={data.server.imageKey}
      />
    </div>
  );
};
