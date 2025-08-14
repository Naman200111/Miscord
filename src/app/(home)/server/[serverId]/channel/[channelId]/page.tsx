import { DEFAULT_MEMBERS_FETCH_LIMIT } from "@/lib/constants";
import ServerView from "@/modules/servers/views/server-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ChannelPageProps {
  params: Promise<{ channelId: string; serverId: string }>;
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const { channelId, serverId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.server.getOne.queryOptions({ serverId }));
  void queryClient.prefetchInfiniteQuery(
    trpc.server.getManyMembers.infiniteQueryOptions({
      serverId,
      limit: DEFAULT_MEMBERS_FETCH_LIMIT,
    })
  );
  void queryClient.prefetchQuery(
    trpc.channel.getMany.queryOptions({ serverId })
  );

  void queryClient.prefetchQuery(
    trpc.channel.getOne.queryOptions({ serverId, channelId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServerView serverId={serverId} channelId={channelId} />
    </HydrationBoundary>
  );
};

export default ChannelPage;
