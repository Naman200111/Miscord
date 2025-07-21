import { Plus } from "lucide-react";
import SidebarButton from "@/modules/home/components/sidebar-button";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../components/theme-switcher";

const ServerSidebarSection = () => {
  return (
    <div className="h-full w-[60px] flex flex-col gap-2 bg-[#2b2b2d] items-center">
      <div className="flex-1">
        <SidebarButton icon={<Plus className="text-foreground" />} />
      </div>
      <div className="my-4 flex flex-col gap-2 items-center">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </div>
  );
};

export default ServerSidebarSection;
