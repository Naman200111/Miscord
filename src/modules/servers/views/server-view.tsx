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
      {channelId ? (
        <ChannelMessagingSection serverId={serverId} channelId={channelId} />
      ) : (
        <div className="h-full w-full justify-center items-center text-center hidden sm:flex bg-[#e5e5e5] dark:bg-[#2e2e2e]">
          Select a channel, to view conversions ☺
        </div>
      )}
    </div>
  );
};

export default ServerView;
