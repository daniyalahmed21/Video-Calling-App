import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

const WS_SERVER = "http://localhost:3000";

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [socket] = useState(() => io(WS_SERVER));

  useEffect(() => {
    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      console.log(`Room created with ID: ${roomId}`);
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", handleRoomCreated);

    return () => {
      socket.off("room-created", handleRoomCreated);
    };
  }, [navigate, socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
