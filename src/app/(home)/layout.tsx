import NavigationSidebarSection from "@/modules/home/sections/navigation-sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.server.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full flex">
        <NavigationSidebarSection />
        {children}
      </div>
    </HydrationBoundary>
  );
};

export default MainLayout;
