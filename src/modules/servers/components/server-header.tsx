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
import ServerManageMembersModal from "./server-manage-members-modal";
import CustomizeChannelModal from "./channel/customize-channel-modal";
import { customizeChannelForm } from "@/types/types";

const ServerHeader = ({
  name,
  role,
  serverId,
  serverImageUrl = "",
  serverImageKey = "",
  inviteCode = "",
  userId,
}: {
  name: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  serverId: string;
  serverImageUrl?: string | null;
  serverImageKey?: string | null;
  inviteCode?: string;
  userId: string;
}) => {
  const isAdmin = role === "ADMIN";
  const isMember = role === "MEMBER";

  const [modalValue, setModalValue] = useState<
    "delete" | "settings" | "invite" | "manage" | "create" | null
  >(null);
  const [form, setForm] = useState<customizeChannelForm>({
    name: "",
    type: "TEXT",
    modalType: "Create",
  });

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
            onClick={() => setModalValue("invite")}
          >
            Invite People
            <UserPlus className="ml-auto text-indigo-500 dark:text-indigo-400" />
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => setModalValue("settings")}>
              Server Settings
              <Settings className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem onClick={() => setModalValue("manage")}>
              Manage Members
              <Users className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem onClick={() => setModalValue("create")}>
              Create Channel
              <CirclePlus className="ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => setModalValue("delete")}
              className="text-red-400 dark:text-red-400"
            >
              Leave Server
              <LogOut className="ml-auto text-red-400 dark:text-red-400" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400 dark:text-red-400"
                onClick={() => setModalValue("delete")}
              >
                Delete Server
                <Trash className="ml-auto text-red-400 dark:text-red-400" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* render modals */}
      {modalValue === "delete" && (
        <ServerLeaveDeletionModal
          open={modalValue === "delete"}
          onClose={() => setModalValue(null)}
          name={name}
          isAdmin={isAdmin}
          serverId={serverId}
        />
      )}

      {modalValue === "settings" && (
        <CustomizeServerModal
          open={modalValue === "settings"}
          onClose={() => setModalValue(null)}
          name={name}
          serverImageUrl={serverImageUrl}
          serverImageKey={serverImageKey}
          serverId={serverId}
        />
      )}

      {modalValue === "invite" && (
        <ServerInviteModal
          open={modalValue === "invite"}
          onClose={() => setModalValue(null)}
          inviteCode={inviteCode}
          serverId={serverId}
          canUpdateInviteCode={isAdmin}
        />
      )}

      {modalValue === "manage" && (
        <ServerManageMembersModal
          open={modalValue === "manage"}
          onClose={() => setModalValue(null)}
          serverId={serverId}
          role={role}
          userId={userId}
        />
      )}

      {modalValue === "create" && (
        <CustomizeChannelModal
          open={modalValue === "create"}
          onClose={() => setModalValue(null)}
          serverId={serverId}
          form={form}
          setForm={setForm}
        />
      )}
    </>
  );
};

export default ServerHeader;
