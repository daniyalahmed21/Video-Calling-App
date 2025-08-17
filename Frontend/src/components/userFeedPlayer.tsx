import { useEffect, useRef } from "react";

const UserFeedPlayer = ({ stream }: { stream: MediaStream }) => {
  const mediaRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaRef.current && stream) mediaRef.current.srcObject = stream;
  }, [stream]);

  return <video ref={mediaRef} muted={true} autoPlay />;
};

export default UserFeedPlayer;
