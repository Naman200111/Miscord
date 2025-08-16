import { DEFAULT_MEMBERS_FETCH_LIMIT } from "@/lib/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ServerLayout({
  params,
  children,
}: {
  params: { serverId: string };
  children: React.ReactNode;
}) {
  const { serverId } = await params;
  const queryClient = getQueryClient();

  // ✅ Prefetch server-wide data only once here
  void queryClient.prefetchQuery(trpc.server.getOne.queryOptions({ serverId }));
  void queryClient.prefetchQuery(
    trpc.channel.getMany.queryOptions({ serverId })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.server.getManyMembers.infiniteQueryOptions({
      serverId,
      limit: DEFAULT_MEMBERS_FETCH_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
