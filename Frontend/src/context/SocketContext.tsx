import Peer from "peerjs";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const WS_SERVER = "http://localhost:3000";

export const SocketContext = createContext<any | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [socket] = useState(() => io(WS_SERVER));
  const [user, setUser] = useState<Peer>();

  useEffect(() => {
    const userId = uuidv4();
    const peerId = new Peer(userId);

    setUser(peerId);
    console.log("userId",user)

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
    <SocketContext.Provider value={{ socket, user }}>
      {children}
    </SocketContext.Provider>
  );
}
