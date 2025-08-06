"use client";

import ErrorComponent from "@/components/custom/error-box";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const InviteSection = ({ inviteCode }: { inviteCode: string }) => {
  return (
    <Suspense fallback={<Loader2Icon className="animate-spin" />}>
      <ErrorBoundary
        fallback={
          <ErrorComponent message="Looks like Invite link has Expired" />
        }
      >
        <InviteSectionSuspense inviteCode={inviteCode} />
      </ErrorBoundary>
    </Suspense>
  );
};

const InviteSectionSuspense = ({ inviteCode }: { inviteCode: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.server.getOneFromInvite.queryOptions(
      { inviteCode },
      { retry: false, enabled: typeof window !== "undefined" }
    )
  );

  queryClient.invalidateQueries(trpc.server.getMany.queryOptions());
  // Todo: getting some error here
  // Get white dash to show the selected server once joined
  router.push(`/server/${data.serverId}`);
  return <></>;
};

export default InviteSection;
