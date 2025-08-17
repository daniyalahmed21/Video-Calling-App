import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const WS_SERVER = "http://localhost:3000";

export const useSocket = () => {
  const navigate = useNavigate();
  const [socket] = useState<Socket>(() => io(WS_SERVER));
  const [peer, setPeer] = useState<Peer | null>(null);
  const [userId] = useState<string>(uuidv4());

  useEffect(() => {
    // Initialize PeerJS only once
    const peerInstance = new Peer(userId);
    setPeer(peerInstance);

    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      console.log(`Room created with ID: ${roomId}`);
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", handleRoomCreated);

    return () => {
      socket.off("room-created", handleRoomCreated);
      peerInstance.destroy(); // Clean up peer connection
    };
  }, [navigate, socket, userId]);

  return { socket, peer, userId };
};