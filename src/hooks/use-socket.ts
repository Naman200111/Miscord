import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export const useSocket = () => {
  const [socketConnected, setSocketConnected] = useState(false);

  const onConnect = () => {
    setSocketConnected(true);
  };
  const onDisconnect = () => {
    setSocketConnected(false);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return socketConnected;
};
