"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus, Trash2 } from "lucide-react";

import {
  channel,
  channelRoles,
  channelType,
  customizeChannelOptions,
  customizeChannelForm,
} from "@/types/types";

import ChannelDeletionModal from "../components/channel/channel-deletion-modal";

interface SingularChannelSectionProps {
  heading: string;
  onOpen: () => void;
  channelIcon: React.ReactNode;
  type: channelType;
  role: channelRoles;
  channels: channel[];
  setForm: (form: customizeChannelForm) => void;
  serverId: string;
}

const SingularChannelSection = ({
  heading,
  onOpen,
  channels,
  channelIcon,
  type,
  role,
  setForm,
  serverId,
}: SingularChannelSectionProps) => {
  const router = useRouter();

  const [channelDeletionData, setChannelDeletionData] = useState({
    name: "",
    channelId: "",
  });

  const handleCustomizeChannel = (
    modalType: customizeChannelOptions,
    type: channelType,
    name: string = "",
    channelId?: string
  ) => {
    setForm({
      name,
      type,
      modalType,
      channelId,
    });

    onOpen();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{heading}</p>
        <div
          className="p-1 rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground"
          onClick={() => handleCustomizeChannel("Create", type, "")}
        >
          <Plus size={16} />
        </div>
      </div>
      {channels.map((channel, index) => (
        <div
          key={index}
          className="flex justify-between items-center hover:bg-muted py-1 rounded-md"
          onClick={() => {
            if (channel.type === "TEXT" || channel.type === "VIDEO") {
              router.push(`/server/${serverId}/channel/${channel.id}`);
            }
          }}
        >
          <div className="text-muted-foreground flex gap-2 items-center px-1">
            {channelIcon}
            <span className="line-clamp-1">{channel.name}</span>
          </div>
          {channel.name !== "general" && role !== "MEMBER" && (
            <div className="flex">
              <div
                className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomizeChannel(
                    "Edit",
                    type,
                    channel.name,
                    channel.id
                  );
                }}
              >
                <Edit size={14} />
              </div>
              <div
                className="p-[6px] rounded-full hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setChannelDeletionData({
                    channelId: channel.id,
                    name: channel.name,
                  });
                }}
              >
                <Trash2 size={14} />
              </div>
            </div>
          )}
        </div>
      ))}
      {channelDeletionData.name && channelDeletionData.channelId && (
        <ChannelDeletionModal
          open={!!channelDeletionData.channelId}
          onClose={() => setChannelDeletionData({ name: "", channelId: "" })}
          serverId={serverId}
          channelId={channelDeletionData.channelId}
          name={channelDeletionData.name}
        />
      )}
    </div>
  );
};

export default SingularChannelSection;
