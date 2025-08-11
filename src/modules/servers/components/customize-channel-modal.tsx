import { Input } from "@/components/ui/input";
import Modal from "@/components/custom/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CustomizeChannelModalProps {
  modalType: "Edit" | "Create";
  name?: string;
  type?: "text" | "audio" | "video";
  open: boolean;
  onClose: () => void;
}

const CustomizeChannelModal = ({
  modalType,
  name,
  type,
  open,
  onClose,
}: CustomizeChannelModalProps) => {
  const [form, setForm] = useState<{
    name: string | undefined;
    type: "text" | "audio" | "video" | undefined;
  }>({
    name,
    type,
  });

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
            onValueChange={(val: "text" | "audio" | "video") =>
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
          <Button size="sm" onClick={() => onClose()} className="px-10">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => console.log(form)}
            disabled={!form.name || !form.type}
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
