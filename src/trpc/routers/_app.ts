import { channelProcedure } from "@/procedures/channel/channel-procedure";
import { createTRPCRouter } from "../init";
import { serverProcedure } from "@/procedures/server/servers-procedure";
import { userProcedure } from "@/procedures/user/user-procedure";
import { messageProcedure } from "@/procedures/messages/message-procedure";

export const appRouter = createTRPCRouter({
  server: serverProcedure,
  channel: channelProcedure,
  message: messageProcedure,
  user: userProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
