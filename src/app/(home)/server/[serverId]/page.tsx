import ServerView from "@/modules/servers/views/server-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;

  const queryClient = getQueryClient();

  // why not working?
  void queryClient.prefetchQuery(trpc.server.getOne.queryOptions({ serverId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServerView serverId={serverId} />
    </HydrationBoundary>
  );
};

export default ServerPage;
