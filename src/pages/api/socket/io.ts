import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
    });

    io.on("connection", (socket) => {
      console.log("Connection Built Successfully");
      socket.on("disconnect", () => {
        console.log("Connection disconnected");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
