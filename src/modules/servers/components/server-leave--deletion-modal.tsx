import Modal from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ServerDeletionModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  isAdmin: boolean;
  serverId: string;
}

const ServerLeaveDeletionModal = ({
  open,
  onClose,
  name = "",
  isAdmin = false,
  serverId,
}: ServerDeletionModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();

  const deleteOrLeaveServer = useMutation(
    trpc.server.deleteOrLeave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.server.getMany.queryOptions());
        toast.message(isAdmin ? "Server Deleted" : "Server Left");

        router.push("/");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );

  const operation = isAdmin ? "Delete" : "Leave";
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-2 items-center">
        <div className="font-bold text-2xl">{operation} Server</div>
        <div className="text-muted-foreground flex gap-1">
          <p>
            Are you sure you want to {operation.toLowerCase()}{" "}
            <span className="text-indigo-500">{name}</span>
          </p>
        </div>

        <div className=" w-full mt-2 h-[40px] flex justify-around">
          <Button
            onClick={onClose}
            className="outline-none"
            disabled={deleteOrLeaveServer.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteOrLeaveServer.mutate({ serverId })}
            className="bg-indigo-400 hover:bg-indigo-500 outline-none"
            disabled={deleteOrLeaveServer.isPending}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServerLeaveDeletionModal;
