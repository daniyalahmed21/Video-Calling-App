// src/pages/Room.tsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/SocketContext";
import { useUserMedia } from "../hooks/useUserMedia";
import Peer from "peerjs";
import UserFeedPlayer from "../components/userFeedPlayer";

// Define an interface for remote users
interface RemoteUser {
  peerId: string;
  stream: MediaStream;
}

const Room = () => {
  const { id } = useParams();
  const context = useContext(SocketContext);
  const { stream, loading, error } = useUserMedia();

  if (!context) {
    throw new Error("Room must be used within a SocketProvider");
  }
  const { socket, userId, peer } = context;

  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

  useEffect(() => {
    // Check if we have all necessary resources
    if (!socket || !id || !userId || !stream || !peer) {
        console.log("Waiting for resources to be ready...", { socket, id, userId, stream, peer });
        return;
    }

    // 1. Tell the server we want to join the room
    socket.emit("join-room", { roomId: id, userId: userId });

    // 2. Handle a call coming from another peer
    peer.on('call', (call) => {
        console.log(`Receiving a call from ${call.peer}`);
        // Answer the call with our local stream
        call.answer(stream);

        // Listen for the remote stream
        call.on('stream', (remoteStream) => {
            console.log(`Received stream from ${call.peer}`);
            setRemoteUsers((prevUsers) => {
                // Add the new user to our state if they don't exist
                const userExists = prevUsers.some(u => u.peerId === call.peer);
                if (!userExists) {
                    return [...prevUsers, { peerId: call.peer, stream: remoteStream }];
                }
                return prevUsers;
            });
        });
    });

    // 3. Handle a new user joining the room (emitted by the server)
    const handleUserJoined = ({ roomId, userId: newUserId }: { roomId: string; userId: string }) => {
        console.log(`User ${newUserId} joined room ${roomId}`);
        // When a new user joins, we initiate a call to them
        const call = peer.call(newUserId, stream);
        
        call.on('stream', (remoteStream) => {
            setRemoteUsers((prevUsers) => {
                const userExists = prevUsers.some(u => u.peerId === newUserId);
                if (!userExists) {
                    return [...prevUsers, { peerId: newUserId, stream: remoteStream }];
                }
                return prevUsers;
            });
        });
    };

    // 4. Handle a list of existing users when we first join
    const handleGetUsers = ({ participants, userId: currentUserId }: { participants: string[], userId: string }) => {
        console.log("Existing users in room:", participants);
        // For each existing user, initiate a call
        participants.forEach(existingUserId => {
            if (existingUserId !== currentUserId) {
                const call = peer.call(existingUserId, stream);
                call.on('stream', (remoteStream) => {
                    setRemoteUsers((prevUsers) => {
                        const userExists = prevUsers.some(u => u.peerId === existingUserId);
                        if (!userExists) {
                            return [...prevUsers, { peerId: existingUserId, stream: remoteStream }];
                        }
                        return prevUsers;
                    });
                });
            }
        });
    };

    // 5. Handle a user disconnecting
    const handleUserDisconnected = ({ userId: disconnectedUserId }: { userId: string }) => {
        console.log(`User ${disconnectedUserId} disconnected`);
        // Filter out the disconnected user from our state
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.peerId !== disconnectedUserId));
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("get-users", handleGetUsers);
    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
        // Clean up listeners when the component unmounts
        socket.off("user-joined", handleUserJoined);
        socket.off("get-users", handleGetUsers);
        socket.off("user-disconnected", handleUserDisconnected);
    };
  }, [socket, id, userId, stream, peer]);

  if (loading) return <div>Loading media devices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Room: {id}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Render local user's video feed */}
        <div>
          <h3>My Video</h3>
          <UserFeedPlayer stream={stream} muted={true} />
        </div>

        {/* Render remote users' video feeds */}
        {remoteUsers.map((user) => (
          <div key={user.peerId}>
            <h3>User: {user.peerId.substring(0, 8)}</h3>
            <UserFeedPlayer stream={user.stream} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;