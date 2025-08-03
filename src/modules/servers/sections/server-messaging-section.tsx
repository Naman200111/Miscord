import Input from "@/components/custom/input";
import { Skeleton } from "@/components/custom/skeleton";
import { Hash, Plus, Smile } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ServerMessagingSectionSkeleton = () => (
  <div className="h-full w-full flex flex-col items-center">
    <Skeleton className="w-full h-12 rounded-none bg-[#ebebeb] dark:bg-[#2e2e2e] shadow-2xl" />
    <Skeleton className="w-full flex-1 rounded-none bg-[#ebebeb] dark:bg-[#2e2e2e]" />
  </div>
);

export const ServerMessagingSection = ({}) => {
  return (
    <Suspense fallback={<ServerMessagingSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Oops...</p>}>
        <ServerMessagingSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ServerMessagingSectionSuspense = () => {
  const channelName = "general";
  return (
    <div className="h-full w-full flex-col items-center hidden sm:flex">
      <div className="w-full h-12 rounded-none bg-[#f7f7f7] dark:bg-[#2b2b2d] shadow z-1 px-4 flex gap-2 items-center">
        <Hash size={22} />
        <p>{channelName}</p>
      </div>
      <div className="w-full flex-1 rounded-none bg-[#f7f7f7] dark:bg-[#2b2b2d] flex flex-col-reverse gap-2">
        <div className="flex items-center mx-2 px-2 my-6 border rounded-md">
          <button className="cursor-pointer bg-muted-foreground rounded-full p-1 ml-2">
            <Plus size={22} className="text-background" />
          </button>
          <Input
            className="my-2 focus:outline-none flex-1 border-0"
            placeholder={`Message #${channelName}`}
          />
          <button className="cursor-pointer rounded-full p-1 mr-2">
            <Smile />
          </button>
        </div>
        <div className="flex flex-col gap-2 m-4">
          <div className="w-20 h-20 p-2 rounded-full flex justify-center items-center bg-[#ececec] dark:bg-[#222222]">
            <Hash size={50} />
          </div>
          <div className="text-3xl font-bold">Welcome to #{channelName}</div>
          <div className="text-md text-muted-foreground">
            This is the start of #{channelName} channel
          </div>
        </div>
      </div>
    </div>
  );
};
