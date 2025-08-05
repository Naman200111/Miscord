"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  CirclePlus,
  LogOut,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import ServerLeaveDeletionModal from "./server-leave--deletion-modal";
import CustomizeServerModal from "@/modules/home/components/customize-server-modal";
import ServerInviteModal from "./server-invite-modal";

const ServerHeader = ({
  name,
  role,
  serverId,
  serverImageUrl = "",
  serverImageKey = "",
  inviteCode = "",
}: {
  name: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  serverId: string;
  serverImageUrl?: string | null;
  serverImageKey?: string | null;
  inviteCode?: string;
}) => {
  const isAdmin = role === "ADMIN";
  const isMember = role === "MEMBER";

  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-between items-center w-full h-12 py-2 px-4 cursor-pointer outline-none hover:bg-[#e5e5e5] dark:hover:bg-[#2e2e2e] transition shadow">
          <p className="line-clamp-1">{name}</p>
          <ChevronDown size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem
            className="text-indigo-500 dark:text-indigo-400"
            onClick={() => setShowInviteModal(true)}
          >
            Invite People
            <UserPlus className="ml-auto text-indigo-500 dark:text-indigo-400" />
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => setShowSettingsModal(true)}>
              Server Settings
              <Settings className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem>
              Manage Members
              <Users className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem>
              Create Channel
              <CirclePlus className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem onClick={() => setShowDeletionModal(true)}>
              Leave Server
              <LogOut className="ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400 dark:text-red-400"
                onClick={() => setShowDeletionModal(true)}
              >
                Delete Server
                <Trash className="ml-auto text-red-400 dark:text-red-400" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {showDeletionModal ? (
        <ServerLeaveDeletionModal
          open={showDeletionModal}
          onClose={() => setShowDeletionModal(false)}
          name={name}
          isAdmin={isAdmin}
          serverId={serverId}
        />
      ) : null}
      {showSettingsModal ? (
        <CustomizeServerModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          name={name}
          serverImageUrl={serverImageUrl}
          serverImageKey={serverImageKey}
          serverId={serverId}
        />
      ) : null}
      {showInviteModal ? (
        <ServerInviteModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          inviteCode={inviteCode}
          serverId={serverId}
        />
      ) : null}
    </>
  );
};

export default ServerHeader;
