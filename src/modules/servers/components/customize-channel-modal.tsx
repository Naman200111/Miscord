"use client";

import Modal from "@/components/custom/modal";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { channelType, customizeChannelForm } from "@/types/types";

interface CustomizeChannelModalProps {
  open: boolean;
  onClose: () => void;
  serverId: string;
  setForm: (form: customizeChannelForm) => void;
  form: customizeChannelForm;
}

const CustomizeChannelModal = ({
  open,
  onClose,
  serverId,
  form,
  setForm,
}: CustomizeChannelModalProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const customizeChannel = useMutation(
    trpc.channel.customize.mutationOptions({
      onSuccess: () => {
        toast.message("Success");
        queryClient.invalidateQueries(
          trpc.channel.getMany.queryOptions({ serverId })
        );
        onClose();
      },
      onError: () => {
        toast.error("Something went wrong !!");
      },
    })
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-full flex flex-col items-center gap-4">
        <p className="text-2xl font-bold mb-4">{form.modalType} Channel</p>
        <div className="w-full px-4 flex flex-col gap-2">
          <p>Channel Name</p>
          <Input
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter channel name"
            value={form.name}
          ></Input>
        </div>
        <div className="w-full px-4 flex flex-col gap-2">
          <p>Channel Type</p>
          <Select
            onValueChange={(val: channelType) =>
              setForm({ ...form, type: val })
            }
            value={form.type}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select channel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Text</SelectItem>
              <SelectItem value="AUDIO">Audio</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="justify-center flex gap-4 w-full mt-4">
          <Button
            size="sm"
            onClick={() => onClose()}
            disabled={!form.name || !form.type || customizeChannel.isPending}
            className="px-10"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() =>
              customizeChannel.mutate({
                name: form.name as string,
                type: form.type,
                serverId,
                channelId: form.channelId,
              })
            }
            disabled={!form.name || !form.type || customizeChannel.isPending}
            className="px-10"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomizeChannelModal;
