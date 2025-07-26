import ServerSidebarSection from "../sections/server-sidebar-section";
import { getServersList } from "@/procedures/home/servers-procedure";

type ServersListType = Awaited<ReturnType<typeof getServersList>>;

interface HomeViewProps {
  serversList: ServersListType;
}

const HomeView = ({ serversList }: HomeViewProps) => {
  return (
    <div className="w-full h-full bg-background">
      <ServerSidebarSection serversList={serversList} />
      {/* <ServerChannelsSection /> */}
      {/* <ChannelMainSection /> */}
    </div>
  );
};

export default HomeView;
