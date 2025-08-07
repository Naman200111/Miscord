"use client";

import ErrorComponent from "@/components/custom/error-box";
import { useTRPC } from "@/trpc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InviteSection = ({ inviteCode }: { inviteCode: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isPending, isSuccess } = useQuery(
    trpc.server.getOneFromInvite.queryOptions({ inviteCode }, { retry: false })
  );

  useEffect(() => {
    // cannot use router.push outside, it fails on server rendering
    if (isSuccess) {
      queryClient.invalidateQueries(trpc.server.getMany.queryOptions());
      router.push(`/server/${data.serverId}`);
    }
  }, [isSuccess, data, queryClient, router, trpc.server.getMany]);

  if (isPending) {
    return <Loader2Icon className="animate-spin" />;
  }

  if (error) {
    return <ErrorComponent message="Looks like Invite link has Expired" />;
  }

  return <></>;
};

export default InviteSection;
