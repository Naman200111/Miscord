interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;
  return <div className="flex">Loaded server : {serverId}</div>;
};

export default ServerPage;
