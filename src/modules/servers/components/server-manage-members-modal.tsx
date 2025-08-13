import InfiniteScroll from "@/components/custom/infinite-scroll";
import Modal from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_MEMBERS_FETCH_LIMIT } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  Brush,
  Check,
  EllipsisVerticalIcon,
  Loader2Icon,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface ServerManageMembersModalProps {
  open: boolean;
  onClose: () => void;
  serverId: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  userId: string;
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
  role,
  userId,
}: ServerManageMembersModalProps) => {
  return (
    <Suspense fallback={<Loader2Icon className="animate-spin" />}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <ServerManageMembersModalSuspense
          open={open}
          onClose={onClose}
          serverId={serverId}
          role={role}
          userId={userId}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

const ServerManageMembersModalSuspense = ({
  open,
  onClose,
  serverId,
  role,
  userId,
}: ServerManageMembersModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.server.getManyMembers.infiniteQueryOptions(
        {
          serverId,
          limit: DEFAULT_MEMBERS_FETCH_LIMIT,
        },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  const members = (data.pages || []).flatMap((page) => page.members);

  const performRoleUpdate = useMutation(
    trpc.server.roleUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.server.getManyMembers.infiniteQueryOptions(
            {
              serverId,
              limit: DEFAULT_MEMBERS_FETCH_LIMIT,
            },
            { getNextPageParam: (lastPage) => lastPage.nextCursor }
          )
        );
        toast.message("Member roles changed");
      },
      onError: (error) => {
        toast.message(error.message || "Something went wrong");
      },
    })
  );

  const performServerKick = useMutation(
    trpc.server.serverKick.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.server.getManyMembers.infiniteQueryOptions(
            {
              serverId,
              limit: DEFAULT_MEMBERS_FETCH_LIMIT,
            },
            { getNextPageParam: (lastPage) => lastPage.nextCursor }
          )
        );
        toast.message("Member kicked from the server.");
      },
      onError: (error) => {
        toast.message(error.message || "Something went wrong");
      },
    })
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="text-xl sm:text-2xl font-bold mb-6 line-clamp-1">
          Manage Members
        </div>
        <div className="flex flex-col gap-4 w-full sm:px-6">
          {members.map((member, index) => {
            const RoleBadge =
              member.role === "ADMIN" ? (
                <ShieldCheck size={18} />
              ) : member.role === "MODERATOR" ? (
                <ShieldAlert size={18} />
              ) : (
                <Shield size={18} />
              );
            return (
              <div key={index} className="flex gap-3 items-center select-none">
                <div className="relative min-w-10 min-h-10 rounded-full overflow-hidden">
                  <Image
                    fill
                    src={member.user.imageUrl || "/user-placeholder.svg"}
                    alt="Avatar"
                  />
                </div>
                <div className="flex flex-col text-sm min-w-0">
                  <p className="line-clamp-1 flex gap-2 items-center">
                    <span className="line-clamp-1">{member.user.name}</span>
                    <span className="flex-shrink-0">{RoleBadge}</span>
                  </p>
                  <p className="text-muted-foreground line-clamp-1 min-w-0">
                    {member.user.email}
                  </p>
                </div>
                {userId !== member.userId &&
                (member.role === "MEMBER" ||
                  (role === "ADMIN" && member.role === "MODERATOR")) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="p-2 outline-none cursor-pointer ml-auto"
                      asChild
                    >
                      <Button
                        disabled={
                          performRoleUpdate.isPending ||
                          performServerKick.isPending
                        }
                        size="icon"
                        variant="ghost"
                      >
                        <EllipsisVerticalIcon size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            disabled={member.role === "MEMBER"}
                            onClick={() =>
                              performRoleUpdate.mutate({
                                receiverUserId: member.userId,
                                from: member.role,
                                to: "MEMBER",
                                serverId,
                              })
                            }
                          >
                            Guest{" "}
                            {member.role === "MEMBER" ? (
                              <Check className="ml-auto" />
                            ) : (
                              <Shield className="ml-auto" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={member.role === "MODERATOR"}
                            onClick={() =>
                              performRoleUpdate.mutate({
                                receiverUserId: member.userId,
                                from: member.role,
                                to: "MODERATOR",
                                serverId,
                              })
                            }
                          >
                            Moderator{" "}
                            {member.role === "MODERATOR" ? (
                              <Check className="ml-auto" />
                            ) : (
                              <ShieldAlert className="ml-auto" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem
                        onClick={() =>
                          performServerKick.mutate({
                            serverId,
                            kickedUserId: member.userId,
                            kickedUserRole: member.role,
                          })
                        }
                      >
                        Kick <Brush size={16} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            );
          })}

          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            fetchNextPage={fetchNextPage}
            manual
          />
        </div>
      </div>
    </Modal>
  );
};

export default ServerManageMembersModal;
