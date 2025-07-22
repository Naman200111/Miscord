"use client";

import { Plus } from "lucide-react";
import SidebarButton from "@/modules/home/components/sidebar-button";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../components/theme-switcher";
// import { Suspense } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { Skeleton } from "@/components/custom/skeleton";
import { getServersList } from "@/procedures/home/servers-procedure";
import { useState } from "react";
import CreateNewServerModal from "../components/create-new-server-modal";

type ServersListType = Awaited<ReturnType<typeof getServersList>>;

interface ServerSidebarSectionProps {
  serversList: ServersListType;
}

// const ServerFetchSkeleton = () => (
//   <div className="h-full py-2 w-[60px] flex flex-col gap-2 bg-[#2b2b2d] items-center">
//     <div className="flex-1">
//       <Skeleton className="h-10 w-10 rounded-full" />
//       <div className="h-[1px] mx-1 my-3 bg-foreground"></div>
//       <div className="flex flex-col gap-2">
//         <Skeleton className="h-10 w-10 rounded-full" />
//         <Skeleton className="h-10 w-10 rounded-full" />
//         <Skeleton className="h-10 w-10 rounded-full" />
//       </div>
//     </div>
//     <div className="my-4 flex flex-col gap-2 items-center">
//       <Skeleton className="h-10 w-10 rounded-full" />
//       <Skeleton className="h-10 w-10 rounded-full" />
//     </div>
//   </div>
// );

// const ServerSidebarSection = ({ serversList }: ServerSidebarSectionProps) => {
//   return (
//     <Suspense fallback={<ServerFetchSkeleton />}>
//       <ErrorBoundary fallback={<TriangleAlert />}>
//         <ServerSidebarSectionSuspense serversList={serversList} />
//       </ErrorBoundary>
//     </Suspense>
//   );
// };

const ServerSidebarSection = ({ serversList }: ServerSidebarSectionProps) => {
  const [createNewServerModalOpen, setCreateNewServerModalOpen] =
    useState(false);

  return (
    <>
      <div className="h-full w-[60px] flex flex-col gap-2 bg-[#2b2b2d] items-center">
        <div className="flex-1">
          <SidebarButton
            icon={<Plus className="text-foreground" />}
            onClick={() => setCreateNewServerModalOpen(true)}
          />
          <div className="h-[1px] mx-1 my-3 bg-background"></div>
          <div className="flex flex-col gap-2">
            {serversList.map(({ server }, index) => (
              <SidebarButton
                key={index}
                imageUrl={server.imageUrl}
                name={server.name}
              />
            ))}
          </div>
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
