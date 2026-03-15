import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { Hash, VideoIcon } from "lucide-react";
import { channel } from "@/types/types";

interface ChannelCommandDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  serverId: string;
  textChannels: channel[];
  // audioChannels: channel[];
  videoChannels: channel[];
}

const ChannelCommandDialog = ({
  open,
  setOpen,
  textChannels,
  // audioChannels,
  videoChannels,
  serverId,
}: ChannelCommandDialogProps) => {
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search channels" />
      <CommandList>
        <CommandEmpty>No results found...</CommandEmpty>
        <CommandGroup heading="Text Channels">
          {textChannels.map((channel, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                router.push(`/server/${serverId}/channel/${channel.id}`);
              }}
            >
              <Hash size={18} />
              <span className="line-clamp-1">{channel.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        {/* <CommandGroup heading="Audio Channels">
          {audioChannels.map((channel, index) => (
            <CommandItem key={index}>
              <Volume2Icon size={18} />
              <span className="line-clamp-1">{channel.name}</span>
            </CommandItem>
          ))}
        </CommandGroup> */}
        <CommandSeparator />
        <CommandGroup heading="Video Channels">
          {videoChannels.map((channel, index) => (
            <CommandItem key={index}>
              <VideoIcon size={18} />
              <span className="line-clamp-1">{channel.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default ChannelCommandDialog;
