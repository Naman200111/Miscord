import { DEFAULT_MESSAGES_LIMIT } from "@/lib/constants";
import ServerView from "@/modules/servers/views/server-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ChannelPageProps {
  params: Promise<{ channelId: string; serverId: string }>;
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const { channelId, serverId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.message.getMany.infiniteQueryOptions({
      channelId,
      serverId,
      limit: DEFAULT_MESSAGES_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServerView serverId={serverId} channelId={channelId} />
    </HydrationBoundary>
  );
};

export default ChannelPage;
