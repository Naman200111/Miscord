import { Input } from "@/components/ui/input";
import Modal from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Copy, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ServerInviteModalProps {
  open: boolean;
  onClose: () => void;
  inviteCode: string;
  serverId: string;
  canUpdateInviteCode?: boolean;
}

const ServerInviteModal = ({
  open,
  onClose,
  inviteCode,
  serverId,
  canUpdateInviteCode = false,
}: ServerInviteModalProps) => {
  const trpc = useTRPC();

  const updateServer = useMutation(
    trpc.server.updateInviteCode.mutationOptions({
      onSuccess: (data) => {
        setServerInviteCode(data.inviteCode);
        toast.message("Invite Link Changed");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );

  const [serverInviteCode, setServerInviteCode] = useState(inviteCode);
  const inviteUrl = `${APP_URL}/invite/${serverInviteCode}`;

  return (
    <Modal open={open} onClose={onClose} className="w-[380px]">
      <div className="w-full flex flex-col gap-10">
        <div className="font-bold text-2xl mx-auto">Invite friends</div>
        <div className="w-full flex flex-col gap-2">
          <div className="font-semibold text-sm text-indigo-400">
            SERVER INVITE LINK
          </div>
          <div className="flex items-center w-full gap-2">
            <Input disabled value={inviteUrl} className="flex-1" />
            <Copy
              size={16}
              className="cursor-pointer flex-shrink-0"
              onClick={() => {
                navigator.clipboard?.writeText(inviteUrl);
                toast.message("Copied to clipboard");
              }}
            />
          </div>
          <Button
            className="flex gap-4 items-center cursor-pointer bg-muted hover:bg-muted mt-2"
            onClick={() => updateServer.mutate({ serverId })}
            disabled={updateServer.isPending || !canUpdateInviteCode}
          >
            <p className="text-foreground">Generate New Link</p>
            <RefreshCwIcon
              size={18}
              className={cn(
                "text-foreground flex-shrink-0",
                updateServer.isPending ? "animate-spin" : ""
              )}
            />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServerInviteModal;
