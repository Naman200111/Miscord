import { getServerData } from "@/procedures/server/servers-procedure";
import ServerDetailsSection from "../sections/server-details-section";
import ServerMessagingSection from "../sections/server-messaging-section";

type ServerViewType = Awaited<ReturnType<typeof getServerData>>;

const ServerView = (serverDetails: ServerViewType) => {
  return (
    <div className="flex flex-1">
      <ServerDetailsSection serverDetails={serverDetails} />
      <ServerMessagingSection />
    </div>
  );
};

export default ServerView;
