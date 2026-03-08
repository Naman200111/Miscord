"use client";

import { io } from "socket.io-client";

export const socket = io({
  path: "/api/socket/io",
  // todo: needed for websocket connection i think -> check
  // transports: ["websocket"],
  // addTrailingSlash: true,
});




// "use client";

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export function getSocket() {
//   if (!socket) {
//     socket = io({
//       path: "/api/socket/io",
//       transports: ["websocket"],
//     });
//   }

//   return socket;
// }