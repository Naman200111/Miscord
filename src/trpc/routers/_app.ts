import { channelProcedure } from "@/procedures/channel/channel-procedure";
import { createTRPCRouter } from "../init";
import { serverProcedure } from "@/procedures/server/servers-procedure";

export const appRouter = createTRPCRouter({
  server: serverProcedure,
  channel: channelProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
