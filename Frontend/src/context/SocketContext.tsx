import  { createContext, type ReactNode } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
import { useSocket } from "../hooks/useSocket";

interface ISocketContext {
  socket: Socket | null;
  peer: Peer | null;
  userId: string;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { socket, peer, userId } = useSocket();

  return (
    <SocketContext.Provider value={{ socket, peer, userId }}>
      {children}
    </SocketContext.Provider>
  );
}