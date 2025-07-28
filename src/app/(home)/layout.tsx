import { getCurrentUser } from "@/lib/get-user";
import ServerSidebarSection from "@/modules/home/sections/server-sidebar-section";
import { getServersList } from "@/procedures/home/servers-procedure";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  const serversList = await getServersList(user?.id);

  return (
    <div className="w-full h-full flex">
      <ServerSidebarSection serversList={serversList} />
      {children}
    </div>
  );
};

export default MainLayout;
