import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useCreateRoom = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useCreateRoom must be used within a SocketProvider");
  }
  const { socket } = context;

  const createRoom = () => {
    if (socket) {
      socket.emit("create-room");
    } else {
      console.error("Socket not connected. Cannot create room.");
    }
  };

  return { createRoom };
};