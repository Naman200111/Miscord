"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Edit, Hash, Loader2Icon, Plus, Trash2 } from "lucide-react";
import ErrorComponent from "@/components/custom/error-box";
import { Input } from "@/components/ui/input";

interface ChannelsSectionProps {
  serverId: string;
}

const ChannelsSkeleton = () => (
  <div className="h-full w-full sm:w-64 md:w-72 flex flex-col items-center justify-center bg-[#ececec] dark:bg-[#222222]">
    <Loader2Icon className="animate-spin" />
  </div>
);

export const ChannelsSection = ({ serverId }: ChannelsSectionProps) => {
  return (
    <Suspense fallback={<ChannelsSkeleton />}>
      <ErrorBoundary
        fallback={
          <ErrorComponent message="You are no longer a part of this server" />
        }
      >
        <ChannelsSectionSuspense serverId={serverId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelsSectionSuspense = ({ serverId }: ChannelsSectionProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.server.getOne.queryOptions({ serverId })
  );

  const { data: channels } = useSuspenseQuery(
    trpc.channel.getMany.queryOptions({ serverId })
  );

  const textChannels = channels.filter((channel) => channel.type === "TEXT");
  const audioChannels = channels.filter((channel) => channel.type === "AUDIO");
  const videoChannels = channels.filter((channel) => channel.type === "VIDEO");

  // const router = useRouter();

  // to conditionally show pages
  const path = usePathname();
  const hasChannel = path.includes("channel");

  return (
    <div
      className={cn(
        "h-full w-full sm:max-w-64 md:max-w-72 flex flex-col gap-2 bg-[#ececec] dark:bg-[#222222] items-center",
        hasChannel ? "hidden sm:flex" : ""
      )}
    >
      <ServerHeader
        name={data.server.name || "Server name"}
        role={data.role}
        serverId={serverId}
        serverImageUrl={data.server.imageUrl}
        serverImageKey={data.server.imageKey}
        inviteCode={data.server.inviteCode}
        userId={data.userId}
      />

      {/* Todo: change properly later */}
      <Input
        className="w-[100%] mx-4"
        placeholder="Search channels / members [Ctrl+K]"
      />

      {/* Render the channels */}
      <div className="flex flex-col gap-6 mt-4 w-[100%] px-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Text Channels</p>
            <div className="p-1 rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
              <Plus size={16} />
            </div>
          </div>
          {textChannels.map((channel, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-muted py-1 rounded-md"
            >
              <div className="text-muted-foreground flex gap-2 items-center px-1">
                <Hash size={18} />
                <span className="line-clamp-1">
                  {/* Todo: breaking on longer texts */}
                  asdnbassadasdsadsadsahdb asd sasdsa
                </span>
              </div>
              <div className="flex">
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Edit size={14} />
                </div>
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Trash2 size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Audio Channels</p>
            <div className="p-1 rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
              <Plus size={16} />
            </div>
          </div>
          {audioChannels.map((channel, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-muted py-1 rounded-md"
            >
              <div className="text-muted-foreground flex gap-2 items-center">
                <Hash size={20} />
                <span className="line-clamp-1">{channel.name}</span>
              </div>
              <div className="flex">
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Edit size={14} />
                </div>
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Trash2 size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Video Channels</p>
            <div className="p-1 rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
              <Plus size={16} />
            </div>
          </div>
          {videoChannels.map((channel, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-muted py-1 rounded-md"
            >
              <div className="text-muted-foreground flex gap-2 items-center">
                <Hash size={20} />
                <span className="line-clamp-1">{channel.name}</span>
              </div>
              <div className="flex">
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Edit size={14} />
                </div>
                <div className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground">
                  <Trash2 size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <Button onClick={() => router.push(`/server/${serverId}/channel/123`)}>
        Click
      </Button> */}
    </div>
  );
};
