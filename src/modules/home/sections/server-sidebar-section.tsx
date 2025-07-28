"use client";

import { Plus } from "lucide-react";
import SidebarButton from "@/modules/home/components/sidebar-button";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../components/theme-switcher";
import { getServersList } from "@/procedures/server/servers-procedure";
import { useState } from "react";
import CreateNewServerModal from "../components/create-new-server-modal";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ServersListType = Awaited<ReturnType<typeof getServersList>>;

interface ServerSidebarSectionProps {
  serversList: ServersListType;
}

const ServerSidebarSection = ({ serversList }: ServerSidebarSectionProps) => {
  const router = useRouter();

  const [activeServerId, setActiveServerId] = useState("");
  const [createNewServerModalOpen, setCreateNewServerModalOpen] =
    useState(false);

  return (
    <>
      <div className="h-full w-[60px] flex flex-col gap-2 bg-[#eff4fa] dark:bg-[#2b2b2d] items-center">
        <div className="mt-3" />
        <SidebarButton
          icon={<Plus className="text-foreground" />}
          tooltipLabel="Create a Server"
          onClick={() => setCreateNewServerModalOpen(true)}
        />
        <div className="h-[1px] mx-1 my-3 bg-[#373738] dark:bg-[#eaeaea] w-[50%]"></div>
        <div className=" overflow-auto no-scrollbar w-full flex-1 flex flex-col gap-3">
          {serversList.map(({ server }, index) => (
            <div key={index} className="group relative">
              <div
                className={cn(
                  "absolute top-[10px] invisible group-hover:visible h-1 group-hover:h-5 duration-100 bg-indigo-400 w-[2px] rounded-tr-2xl rounded-br-2xl",
                  server.id === activeServerId ? "visible h-5" : ""
                )}
              ></div>

              <SidebarButton
                imageUrl={server.imageUrl}
                name={server.name}
                className="mx-auto"
                key={index}
                tooltipLabel={server.name}
                onClick={() => {
                  router.push(`/server/${server.id}`);
                  setActiveServerId(server.id);
                }}
              />
            </div>
          ))}
        </div>
        <div className="my-4 flex flex-col gap-2 items-center">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
      <CreateNewServerModal
        open={createNewServerModalOpen}
        onClose={() => setCreateNewServerModalOpen(false)}
      />
    </>
  );
};

export default ServerSidebarSection;
