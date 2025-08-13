"use client";

import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ServerHeader from "../components/server-header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ErrorComponent from "@/components/custom/error-box";

import { Hash, Loader2Icon, VideoIcon, Volume2Icon } from "lucide-react";

import CustomizeChannelModal from "../components/channel/customize-channel-modal";
import SingularChannelSection from "./singular-channel-section";

import { customizeChannelForm } from "@/types/types";
import ChannelCommandDialog from "../components/channel/channel-command-dialog";

interface ChannelsSectionProps {
  serverId: string;
}

const ChannelsSkeleton = () => (
  <div className="h-full w-full sm:max-w-64 md:max-w-72 flex flex-col items-center justify-center bg-[#ececec] dark:bg-[#222222]">
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

  // to conditionally show pages
  const path = usePathname();
  const hasChannel = path.includes("channel");

  const [open, setOpen] = useState(false);
  const [openCustomizeChannelModal, setOpenCustomizeChannelModal] =
    useState(false);
  const [form, setForm] = useState<customizeChannelForm>({
    name: "",
    type: "TEXT",
    modalType: "Create",
  });

  useEffect(() => {
    const handleSearchKeyClick = (e: globalThis.KeyboardEvent) => {
      e.preventDefault();
      if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) {
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleSearchKeyClick);
    return () => removeEventListener("keydown", handleSearchKeyClick);
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full sm:w-64 md:w-72 flex flex-col gap-2 bg-[#ececec] dark:bg-[#222222] items-center select-none",
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

      <div className="px-2 w-full cursor-pointer">
        <div
          className="flex items-center justify-between dark:bg-input/30 rounded-md w border shadow-xs py-1 px-2"
          onClick={() => setOpen(true)}
        >
          <p>Search</p>
          <p className="text-muted-foreground text-sm ml-auto">
            Press{" "}
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-[10px]">⌘</span>
              <span className="text-xs">K</span>
            </kbd>
          </p>
        </div>
      </div>

      <ChannelCommandDialog
        open={open}
        setOpen={setOpen}
        textChannels={textChannels}
        audioChannels={audioChannels}
        videoChannels={videoChannels}
        serverId={serverId}
      />

      {/* Render the channels */}
      <div className="flex flex-col gap-6 mt-4 w-[100%] px-2 overflow-auto no-scrollbar mb-4">
        <SingularChannelSection
          channelIcon={<Hash size={18} className="flex-shrink-0" />}
          channels={textChannels}
          heading="Text Channels"
          onOpen={() => setOpenCustomizeChannelModal(true)}
          type="TEXT"
          role={data.role}
          setForm={setForm}
          serverId={serverId}
        />
        <SingularChannelSection
          channelIcon={<Volume2Icon size={18} className="flex-shrink-0" />}
          channels={audioChannels}
          heading="Audio Channels"
          onOpen={() => setOpenCustomizeChannelModal(true)}
          type="AUDIO"
          role={data.role}
          setForm={setForm}
          serverId={serverId}
        />
        <SingularChannelSection
          channelIcon={<VideoIcon size={18} className="flex-shrink-0" />}
          channels={videoChannels}
          heading="Video Channels"
          onOpen={() => setOpenCustomizeChannelModal(true)}
          type="VIDEO"
          role={data.role}
          setForm={setForm}
          serverId={serverId}
        />
      </div>

      {openCustomizeChannelModal && (
        <CustomizeChannelModal
          open={openCustomizeChannelModal}
          form={form}
          setForm={setForm}
          onClose={() => setOpenCustomizeChannelModal(false)}
          serverId={serverId}
        />
      )}
    </div>
  );
};
