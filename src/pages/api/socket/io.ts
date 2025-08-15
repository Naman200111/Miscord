import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { messageData } from "@/types/types";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

// Todo: give proper types
export default function handler(req: NextApiRequest, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
    });

    io.on("connection", (socket) => {
      console.log("Connection Built Successfully");

      socket.on(`chat:message`, async (msgData: messageData) => {
        const { channelId, serverId, userId, msg, temp_id } = msgData;

        try {
          console.log("adding message to db");
          socket.emit(`chat:message`, msgData);

          const [addMessage] = await db
            .insert(messages)
            .values({ channelId, serverId, userId, msg })
            .returning();

          console.log("message add to db");
          io.emit(`chat:message`, {
            userId: addMessage.userId,
            channelId: addMessage.channelId,
            serverId: addMessage.serverId,
            updatedAt: addMessage.updatedAt,
            msg: addMessage.msg,
            state: "success",
            temp_id,
          });

          console.log("message emitted to everyone");
        } catch {
          console.log("error here");
          socket.emit(`error:sending`, { ...msgData, state: "error" });
        }

        // todo: add rate limiting
      });

      socket.on("disconnect", () => {
        console.log("Connection disconnected");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
