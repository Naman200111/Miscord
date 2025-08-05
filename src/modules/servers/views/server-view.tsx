import { ChannelsSection } from "../sections/channels-section";
import { ChannelMessagingSection } from "../sections/channel-messaging-section";

const ServerView = ({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId?: string;
}) => {
  return (
    <div className="flex flex-1 w-full h-full">
      <ChannelsSection serverId={serverId} />
      <ChannelMessagingSection serverId={serverId} channelId={channelId} />
    </div>
  );
};

export default ServerView;
