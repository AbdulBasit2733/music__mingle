"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactPlayer from "react-player";
const NowPlaying = ({
  creatorId,
  playVideo,
}: {
  creatorId: string;
  playVideo: boolean;
}) => {
  const { data: session } = useSession();
  const [currentStream, setCurrentStream] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const [start, setStart] = useState(false);

  const handleStartPlay = () => {
    setStart(true);
  };

  useEffect(() => {
    if (!creatorId || !session) return;

    let isMounted = true;

    const fetchCurrentStream = async () => {
      try {
        const res = await fetch(`/api/streams?creatorId=${creatorId}`);
        if (!res.ok) throw new Error("Failed to fetch current stream");

        const data = await res.json();
        if (isMounted) {
          setQueue(data.streams || []);
          setCurrentStream(data.activeStream || null);
        }
      } catch (error) {
        console.error("Error fetching current stream:", error);
      }
    };

    fetchCurrentStream();
    return () => {
      isMounted = false;
    };
  }, [creatorId, session]);

  const playNext = async () => {
    if (queue.length === 0) return;
    try {
      setPlayNextLoader(true);
      const resp = await axios.get("/api/streams/next", {
        withCredentials: true,
      });
      if (resp.data.success) {
        setCurrentStream(resp.data.data);
        setQueue((q) => q.filter((x) => x.id !== resp.data.data?.id));
      }
    } catch (error) {
      console.error("Error playing next stream:", error);
    } finally {
      setPlayNextLoader(false);
    }
  };

  return (
    playVideo && (
      <motion.div
        className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 p-4 mx-5"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col items-center justify-between">
          <div className="flex items-center gap-4">
            {currentStream?.stream?.extractedId ? (
              <>
                <ReactPlayer
                  playing={true}
                  controls
                  width="650px"
                  height="250px"
                  onEnded={() => playNext()}
                  url={`https://www.youtube.com/embed/${currentStream?.stream?.extractedId}?autoplay=1&mute=1`}
                  config={{
                    youtube: {
                      playerVars: { autoplay: 1, mute: 1 },
                    },
                  }}
                />

                {/* <iframe
                  src={`https://www.youtube.com/embed/${currentStream.stream.extractedId}?autoplay=1`}
                  allow="autoplay"
                  className="w-64 h-36"
                ></iframe> */}
              </>
            ) : (
              <img
                src={
                  currentStream?.stream?.bigImg ||
                  "https://i.pinimg.com/736x/26/30/35/263035ac32db539bde41ed51f766ea18.jpg"
                }
                alt="Now Playing"
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-200">
                {currentStream?.stream?.title || "No stream playing"}
              </h3>
              <p className="text-sm text-gray-400">
                {currentStream?.stream?.type || "Unknown Type"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Button
              disabled={queue.length <= 1}
              variant="ghost"
              size="icon"
              className="hover:text-purple-400 transition-colors duration-300"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              // disabled={playNextLoader || queue.length <= 1}
              onClick={playNext}
              variant="ghost"
              size="icon"
              className="hover:text-purple-400 transition-colors duration-300"
            >
              {playNextLoader ? (
                "Loading..."
              ) : (
                <SkipForward className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default NowPlaying;
