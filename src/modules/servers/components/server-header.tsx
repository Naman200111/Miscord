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
import CreateNewServerModal from "@/modules/home/components/create-new-server-modal";

const ServerHeader = ({
  name,
  role,
  serverId,
  serverImageUrl = "",
  serverImageKey = "",
}: {
  name: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  serverId: string;
  serverImageUrl?: string | null;
  serverImageKey?: string | null;
}) => {
  const isAdmin = role === "ADMIN";
  const isMember = role === "MEMBER";

  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-between items-center w-full h-12 py-2 px-4 cursor-pointer outline-none hover:bg-[#dedede] dark:hover:bg-[#2e2e2e] transition shadow">
          <p className="line-clamp-1">{name}</p>
          <ChevronDown size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem className="text-indigo-500 dark:text-indigo-400">
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
            <DropdownMenuItem>
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
        <CreateNewServerModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          name={name}
          serverImageUrl={serverImageUrl}
          serverImageKey={serverImageKey}
          serverId={serverId}
        />
      ) : null}
    </>
  );
};

export default ServerHeader;
