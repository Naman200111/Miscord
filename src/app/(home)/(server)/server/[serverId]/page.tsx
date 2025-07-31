import ServerView from "@/modules/servers/views/server-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;

  const queryClient = getQueryClient();

  // why not working?
  void queryClient.prefetchQuery(trpc.server.getOne.queryOptions({ serverId }));

  return <ServerView serverId={serverId} />;
};

export default ServerPage;
