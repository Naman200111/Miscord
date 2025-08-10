import { DEFAULT_MEMBERS_FETCH_LIMIT } from "@/lib/constants";
import ServerView from "@/modules/servers/views/server-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.server.getOne.queryOptions({ serverId }));
  void queryClient.prefetchInfiniteQuery(
    trpc.server.getManyMembers.infiniteQueryOptions({
      serverId,
      limit: DEFAULT_MEMBERS_FETCH_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServerView serverId={serverId} />
    </HydrationBoundary>
  );
};

export default ServerPage;
