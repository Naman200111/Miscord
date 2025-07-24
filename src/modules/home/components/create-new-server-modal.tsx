"use client";

import axios from "axios";
import Input from "@/components/custom/input";
import Modal from "@/components/custom/modal";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { deleteImage } from "@/app/actions/server-actions";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  name: "",
  imageUrl: "",
  imageKey: "",
};

const CreateNewServerModal = ({ open, onClose }: ModalProps) => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  const onUploadFailed = () => {
    toast.error("Upload Failed");
  };

  const handleServerCreate = async () => {
    try {
      await axios.post("/api/server", form);
      router.refresh();

      setForm(initialForm);
      onClose();

      toast.message("Server Created");
    } catch {
      toast.error("Failed to create server");
    }
  };

  const handleImageRemove = async () => {
    try {
      await deleteImage(form.imageKey);
      setForm((prev) => ({ ...prev, imageUrl: "", imageKey: "" }));

      toast.message("Image Removed");
    } catch (err) {
      console.log(err, "err");
      toast.error("Failed to remove image");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold text-center">Create your own server</p>
        <p className="text-muted-foreground text-sm text-center">
          Give your server a personality with a name and an image. You can
          always change that later
        </p>
        {form.imageUrl ? (
          <div className="h-28 w-28 relative mt-4">
            <Image
              fill
              src={form.imageUrl}
              alt="logo"
              className="rounded-full"
            />
            <Button
              className="h-6 w-6 absolute right-2 top-0 bg-red-500 rounded-full cursor-pointer hover:bg-red-500"
              onClick={handleImageRemove}
            >
              <X />
            </Button>
          </div>
        ) : (
          <UploadButton
            endpoint="serverImageUploader"
            className="mt-4"
            onClientUploadComplete={async (params) => {
              try {
                const [data] = params;
                console.log(data, " upload data");

                setForm((prev) => ({
                  ...prev,
                  imageUrl: data.ufsUrl,
                  imageKey: data.key,
                }));

                toast.success("Upload complete!");
              } catch (err) {
                console.error("UploadThing error:", err);
                toast.error("Upload failed");
              }
            }}
            onUploadAborted={onUploadFailed}
            onUploadError={onUploadFailed}
          />
        )}

        <div className="mt-2 self-center w-[80%] min-w-[200px]">
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
          className="w-[80%] min-w-[200px] mt-2 cursor-pointer"
          onClick={handleServerCreate}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default CreateNewServerModal;
