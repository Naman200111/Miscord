"use client";

import { io } from "socket.io-client";

export const socket = io({
  path: "/api/socket/io",
  // todo: needed for websocket connection i think -> check
  // transports: ["websocket"],
  // addTrailingSlash: true,
});
