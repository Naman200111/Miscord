"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const InviteSection = ({ inviteCode }: { inviteCode: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery(
    trpc.server.getOneFromInvite.queryOptions({ inviteCode })
  );

  if (error) {
    return <p className="font-semibold text-xl">Oops... {error.message}</p>;
  }

  if (!data) {
    return <Loader2Icon className="animate-spin" />;
  }

  if (!isPending) {
    queryClient.invalidateQueries(trpc.server.getMany.queryOptions());
  }

  // Todo: getting some error here
  // Get white dash to show the selected server once joined
  router.push(`/server/${data.serverId}`);
  return <></>;
};

export default InviteSection;
