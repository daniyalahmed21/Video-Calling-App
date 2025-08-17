import { useEffect, useState } from "react";

export const useUserMedia = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        setLoading(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        setError(null);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setError("Error accessing media devices. Please check your permissions.");
      } finally {
        setLoading(false);
      }
    };

    getMedia();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { stream, loading, error };
};