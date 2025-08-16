import { createContext } from "react";
import io from "socket.io-client";

const WS_SERVER = "http://localhost:3000";
const socket = io(WS_SERVER);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketContext = createContext<any | null>(null);
export function SocketProvider({ children }: { children: React.ReactNode }) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
