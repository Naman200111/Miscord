"use client";

import { ChannelsSection } from "../sections/channels-section";
import { ChannelMessagingSection } from "../sections/channel-messaging-section";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import MediaRoom from "../sections/media-room";

const ServerView = ({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId?: string;
}) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.channel.getOne.queryOptions(
      { serverId, channelId: channelId! },
      { enabled: !!channelId },
    ),
  );

  return (
    <div className="flex flex-1 w-full h-full">
      <ChannelsSection serverId={serverId} />
      {channelId && data ? (
        data.type === "VIDEO" ?
        <MediaRoom
          serverId={serverId}
          channelName={data.name}
          channelId={channelId}
        /> : <ChannelMessagingSection
          serverId={serverId}
          channelData={data!}
          channelId={channelId}
        />
      ) : (
        <div className="h-full w-full justify-center items-center text-center hidden sm:flex bg-[#e5e5e5] dark:bg-[#2e2e2e]">
          {!data && channelId ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>Select a channel, to view conversions ☺</>
          )}
        </div>
      )}
    </div>
  );
};

export default ServerView;
