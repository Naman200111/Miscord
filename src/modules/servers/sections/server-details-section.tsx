"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";

interface ServerDetailsSectionProps {
  serverId: string;
}

export const ServerDetailsSection = ({
  serverId,
}: ServerDetailsSectionProps) => {
  return (
    <Suspense fallback={<p>Loading</p>}>
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

  console.log(data, " data");
  return (
    <div className="h-full w-60 flex flex-col gap-2 bg-[#ebebeb] dark:bg-[#222222] items-center">
      <ServerHeader name={data.server.name || "Server name"} role={data.role} />
    </div>
  );
};
