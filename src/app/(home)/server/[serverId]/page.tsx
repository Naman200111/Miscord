import ServerView from "@/modules/servers/views/server-view";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;
  return <ServerView serverId={serverId} />;
};

export default ServerPage;
