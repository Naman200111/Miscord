import { getCurrentUser } from "@/lib/get-user";
import ServerView from "@/modules/servers/views/server-view";
import { getServerData } from "@/procedures/server/servers-procedure";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const { serverId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/");
  }

  const serverUserData = await getServerData({
    serverId,
    userId: currentUser.id,
  });

  if (!serverUserData) {
    redirect("/");
  }

  return <ServerView {...serverUserData} />;
};

export default ServerPage;
