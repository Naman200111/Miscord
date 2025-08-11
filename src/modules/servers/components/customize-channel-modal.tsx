"use client";

import { useState } from "react";

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

interface CustomizeChannelModalProps {
  modalType: "Edit" | "Create";
  name?: string;
  type?: "TEXT" | "AUDIO" | "VIDEO";
  open: boolean;
  onClose: () => void;
  serverId: string;
}

const CustomizeChannelModal = ({
  modalType,
  name,
  type,
  open,
  onClose,
  serverId,
}: CustomizeChannelModalProps) => {
  const trpc = useTRPC();

  const [form, setForm] = useState<{
    name: string | undefined;
    type: "TEXT" | "AUDIO" | "VIDEO";
  }>({
    name,
    type: type || "TEXT",
  });

  const queryClient = useQueryClient();

  const createChannel = useMutation(
    trpc.channel.create.mutationOptions({
      onSuccess: () => {
        toast.message("Channel created");
        queryClient.invalidateQueries(
          trpc.channel.getMany.queryOptions({ serverId })
        );
      },
      onError: () => {
        toast.error("Something went wrong !!");
      },
    })
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-full flex flex-col items-center gap-4">
        <p className="text-2xl font-bold mb-4">{modalType} Channel</p>
        <div className="w-full px-4 flex flex-col gap-2">
          <p>Channel Name</p>
          <Input
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter channel name"
          ></Input>
        </div>
        <div className="w-full px-4 flex flex-col gap-2">
          <p>Channel Type</p>
          <Select
            onValueChange={(val: "TEXT" | "AUDIO" | "VIDEO") =>
              setForm({ ...form, type: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select channel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="justify-center flex gap-4 w-full mt-4">
          <Button
            size="sm"
            onClick={() => onClose()}
            disabled={!form.name || !form.type || createChannel.isPending}
            className="px-10"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => console.log(form)}
            disabled={!form.name || !form.type || createChannel.isPending}
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
