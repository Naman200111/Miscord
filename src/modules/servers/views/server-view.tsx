import { ServerDetailsSection } from "../sections/server-details-section";
import ServerMessagingSection from "../sections/server-messaging-section";

const ServerView = ({ serverId }: { serverId: string }) => {
  return (
    <div className="flex flex-1">
      <ServerDetailsSection serverId={serverId} />
      <ServerMessagingSection />
    </div>
  );
};

export default ServerView;
