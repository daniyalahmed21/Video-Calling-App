import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/SocketContext";

const Room = () => {
  const { id } = useParams();
  const { socket, user } = useContext(SocketContext) as {
    socket: any;
    user: { _id: string; name?: string };
  };

  useEffect(() => {
    if (!socket || !id || !user) return;

    socket.emit("join-room", { roomId: id, userId: user._id });

    const handleRoomJoined = (data: { roomId: string; userId: string }) => {
      console.log(
        `User ${data.userId} joined room ${data.roomId}`
      );
    };

    socket.on("room-joined", handleRoomJoined);

    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket, id, user]);

  return <div>Room {id}</div>;
};

export default Room;
