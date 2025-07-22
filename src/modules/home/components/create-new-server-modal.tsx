"use client";

import axios from "axios";
import Input from "@/components/custom/input";
import Modal from "@/components/custom/modal";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateNewServerModal = ({ open, onClose }: ModalProps) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
  });

  const onUploadFailed = () => {
    toast.error("Upload Failed");
  };

  const handleServerCreate = async () => {
    try {
      const create = await axios.post("/api/server", form);
      console.log(create, "create");
      onClose();
      router.refresh();
      toast.message("Server Created");
    } catch {
      toast.error("Failed to create server");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold">Create your own server</p>
        <p className="text-muted-foreground text-sm text-center">
          Give your server a personality with a name and an image. You can
          always change that later
        </p>
        <UploadDropzone
          endpoint="serverImageUploader"
          onClientUploadComplete={async (params) => {
            const [data] = await params;
            setForm((prev) => ({
              ...prev,
              imageUrl: data.ufsUrl,
            }));

            toast.message("Upload Complete");
          }}
          onUploadAborted={onUploadFailed}
          onUploadError={onUploadFailed}
        />

        <div className="mt-4 self-start ml-10 w-[80%]">
          <p className="font-semibold text-muted-foreground mb-1">
            Server Name
          </p>
          <Input
            placeholder="Enter your server name"
            className="py-2 bg-muted w-full"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            value={form.name}
          />
        </div>

        <Button
          className="w-[80%] ml-2 mt-2 cursor-pointer"
          onClick={handleServerCreate}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default CreateNewServerModal;
