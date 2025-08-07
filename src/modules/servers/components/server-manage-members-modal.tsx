import Modal from "@/components/custom/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Brush, EllipsisVerticalIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ServerManageMembersModalProps {
  open: boolean;
  onClose: () => void;
  serverId: string;
}

const ErrorComponent = () => (
  <div className="flex gap-2 items-center justify-center bg-background text-center p-8 rounded-lg">
    <div className="text-xl mb-4">💥</div>
    <p className="text-muted-foreground  max-w-md">
      Something went wrong while loading the members of the server
    </p>
  </div>
);

const ServerManageMembersModal = ({
  open,
  onClose,
  serverId,
}: ServerManageMembersModalProps) => {
  return (
    <Suspense fallback={<Loader2Icon className="animate-spin" />}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <ServerManageMembersModalSuspense
          open={open}
          onClose={onClose}
          serverId={serverId}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

const ServerManageMembersModalSuspense = ({
  open,
  onClose,
  serverId,
}: ServerManageMembersModalProps) => {
  const trpc = useTRPC();
  const { data: members } = useSuspenseQuery(
    trpc.server.getManyMembers.queryOptions({ serverId })
  );

  const modalContentRef = useRef<HTMLDivElement>(null);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center" ref={modalContentRef}>
        <div className="text-2xl font-bold mb-4">Manage Members</div>
        <div className="flex flex-col gap-4 w-[90%]">
          {members.map((member, index) => (
            <div key={index} className="flex gap-3 items-center select-none">
              <div className="relative min-w-10 min-h-10 rounded-full overflow-hidden">
                <Image
                  fill
                  src={member.user.imageUrl || "/user-placeholder.svg"}
                  alt="Avatar"
                />
              </div>
              <div className="flex flex-col text-sm flex-1">
                <p className="line-clamp-1">{member.user.name}</p>
                <p className="text-muted-foreground line-clamp-1">
                  {member.user.email}
                </p>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                  <EllipsisVerticalIcon
                    size={16}
                    className="focus:outline-none cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuPortal container={modalContentRef.current}>
                  <DropdownMenuContent className="z-[10000]">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Kick</DropdownMenuSubTrigger>
                      {/* <DropdownMenuPortal> */}
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Guest</DropdownMenuItem>
                        <DropdownMenuItem>Moderator</DropdownMenuItem>
                      </DropdownMenuSubContent>
                      {/* </DropdownMenuPortal> */}
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                      Kick <Brush size={16} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ServerManageMembersModal;
