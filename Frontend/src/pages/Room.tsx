import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/SocketContext";

const Room = () => {
  const { id } = useParams();
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Room must be used within a SocketProvider");
  }
  const { socket, userId } = context;

  useEffect(() => {
    if (!socket || !id || !userId) return;

    socket.emit("join-room", { roomId: id, userId: userId });

    const handleRoomJoined = (data: { roomId: string; userId: string }) => {
      console.log(
        `User ${data.userId} joined room ${data.roomId}`
      );
    };

    socket.on("room-joined", handleRoomJoined);

    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket, id, userId]);

  return <div>Room {id}</div>;
};

export default Room;