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

      socket.on(`chat:message`, (msgData) => {
        const { channelId, serverId, userId } = msgData;

        // todo: add rate limiting

        // insertion in db table (messages) => channelId, serverId, userId, message
        // on failure emit a message to sender only using socket.emit ('error:sending')

        io.emit(`chat:message`, {
          message: msgData.message,
          userId,
          channelId,
          serverId,
          timestamp: new Date(), // maybe from db entry is betteer
        });
      });

      socket.on("disconnect", () => {
        console.log("Connection disconnected");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
