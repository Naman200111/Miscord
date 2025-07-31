"use client";

import Input from "@/components/custom/input";
import Modal from "@/components/custom/modal";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [form, setForm] = useState(initialForm);
  const [fileReset, setFileReset] = useState(0);

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createServer = useMutation(
    trpc.server.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.server.getMany.queryOptions());

        setForm(initialForm);
        onClose();

        toast.message("Server Created");
      },
      onError: () => {
        toast.error("Failed to create server");
      },
    })
  );

  const deleteServerImage = useMutation(
    trpc.server.deleteServerImage.mutationOptions({
      onSuccess: () => {
        setForm((prev) => ({ ...prev, imageUrl: "", imageKey: "" }));
        toast.message("Image Removed");
      },
      onError: () => {
        toast.error("Failed to remove image");
      },
    })
  );

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
              onClick={() =>
                deleteServerImage.mutate({ imageKey: form.imageKey })
              }
            >
              <X />
            </Button>
          </div>
        ) : (
          <UploadButton
            key={fileReset}
            endpoint="serverImageUploader"
            className="mt-4"
            onClientUploadComplete={async (params) => {
              try {
                const [data] = params;

                setForm((prev) => ({
                  ...prev,
                  imageUrl: data.ufsUrl,
                  imageKey: data.key,
                }));

                toast.success("Upload complete!");
              } catch (err) {
                console.error("UploadThing error:", err);
                toast.error("Upload failed");
              } finally {
                setFileReset((prev) => 1 - prev);
              }
            }}
            onUploadError={(error) => {
              setFileReset((prev) => 1 - prev);
              if (error.message.includes("FileSizeMismatch")) {
                toast.error("File Size Limit Exceeded");
                return;
              }
              console.log(error.message, "Upload Failed");
              toast.error("Upload Failed");
            }}
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
          onClick={() => createServer.mutate(form)}
          disabled={createServer.isPending}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default CreateNewServerModal;
