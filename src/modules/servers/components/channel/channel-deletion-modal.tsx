import Modal from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChannelDeletionModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  serverId: string;
  channelId: string;
}

const ChannelDeletionModal = ({
  open,
  onClose,
  name = "",
  serverId,
  channelId,
}: ChannelDeletionModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();

  const deleteChannel = useMutation(
    trpc.channel.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.channel.getMany.queryOptions({ serverId })
        );
        toast.success("Success");
        router.push(`/server/${serverId}`);
        onClose();
      },
      onError: (error) => {
        if (
          error.data?.code === "BAD_REQUEST" ||
          error.data?.code === "UNAUTHORIZED"
        )
          toast.error(error.message);
        else {
          toast.error("Something went wrong");
        }
      },
    })
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-2 items-center px-4">
        <div className="font-bold text-2xl">Delete Channel</div>
        <div className="text-muted-foreground flex gap-1">
          <p>
            Are you sure you want to delete{" "}
            <span className="text-indigo-500">{name}</span>
          </p>
        </div>

        <div className=" w-full mt-5 flex justify-around">
          <Button
            onClick={onClose}
            className="outline-none"
            disabled={deleteChannel.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteChannel.mutate({ serverId, channelId })}
            className="bg-indigo-400 hover:bg-indigo-500 outline-none"
            disabled={deleteChannel.isPending}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChannelDeletionModal;
