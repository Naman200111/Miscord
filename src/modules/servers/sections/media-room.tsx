import { LiveKitRoom } from "@livekit/components-react";

import ErrorComponent from "@/components/custom/error-box";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ChannelHeader from "../components/channel/channel-header";

import "@livekit/components-styles";
import { CustomVideoConference } from "../components/channel/custom-video-conference";

interface MediaRoomProps {
  channelId: string;
  serverId: string;
  channelName: string;
}

export const MediaRoom = ({
  channelId,
  serverId,
  channelName,
}: MediaRoomProps) => {
  return (
    <Suspense>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <MediaRoomSuspense
          channelName={channelName}
          serverId={serverId}
          channelId={channelId}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

const MediaRoomSuspense = ({
  channelId,
  serverId,
  channelName,
}: MediaRoomProps) => {
  const { user } = useUser();
  const name = `${user?.firstName} ${user?.lastName}`;
  const userId = user?.id;

  const [token, setToken] = useState("");

  useEffect(() => {
    const setup = async () => {
      try {
        const response = await fetch(
          `/api/livekit?name=${name}&userId=${userId}&roomId=${channelId}`,
        );
        const { token } = await response.json();
        setToken(token);
      } catch (e) {
        console.log(e);
      }
    };

    setup();
  }, [userId, channelId, name]);

  if (!token) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex-col items-center flex bg-[#e5e5e5] dark:bg-[#2e2e2e]">
      <ChannelHeader name={channelName} serverId={serverId} />
      <div className="flex-1 w-full overflow-auto">
        <LiveKitRoom
          data-lk-theme="default"
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          token={token}
          connect={true}
          video={true}
          audio={true}
        >
          <CustomVideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default MediaRoom;
