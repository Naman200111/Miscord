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
const ServerHeader = ({
  name,
  role,
}: {
  name: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
}) => {
  const isAdmin = role === "ADMIN";
  const isMember = role === "MEMBER";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-between items-center w-full py-2 px-4 cursor-pointer outline-none hover:bg-[#dedede] dark:hover:bg-[#2e2e2e] transition shadow">
        {name}
        <ChevronDown size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem className="text-indigo-500 dark:text-indigo-400">
          Invite People
          <UserPlus className="ml-auto text-indigo-500 dark:text-indigo-400" />
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem>
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
            <DropdownMenuItem className="text-red-400 dark:text-red-400">
              Delete Server
              <Trash className="ml-auto text-red-400 dark:text-red-400" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
