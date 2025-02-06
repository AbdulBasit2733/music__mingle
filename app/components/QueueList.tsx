"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useState, useCallback } from "react";

interface Video {
  id: string;
  title: string;
  smallImg: string;
  bigImg: string;
  upvotes: number;
  url: string;
  haveUpvoted: boolean;
}

interface QueueListProps {
  data: Video[];
}

const QueueList = ({ data }: QueueListProps) => {
  const [videos, setVideos] = useState(data);

  const handleVote = useCallback(async (streamId: string, isUpvote: boolean) => {
    try {
      // Optimistic UI update
      setVideos((prev) =>
        prev.map((video) =>
          video.id === streamId
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: isUpvote,
              }
            : video
        )
      );

      const endpoint = isUpvote ? "/api/streams/upvotes" : "/api/streams/downvotes";
      await axios.post(endpoint, { streamId }, { withCredentials: true });
    } catch (error) {
      console.error("Error updating vote:", error);
      // Revert UI update on failure
      setVideos((prev) => prev.map((video) => (video.id === streamId ? { ...video, haveUpvoted: !isUpvote } : video)));
    }
  }, []);

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-300">Up Next</h2>
      <div className="space-y-4 flex flex-col items-center">
        {videos.map((cont, index) => (
          <motion.div
            key={cont.id}
            className="flex max-w-xl justify-center items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-md rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
          >
            <Link href={cont.url}>
              <img
                src={cont.smallImg || "/placeholder.svg"}
                alt={cont.title}
                className="w-24 h-16 object-cover rounded-md"
              />
            </Link>
            <div>
              <h3 className="font-medium text-sm text-gray-200">{cont.title}</h3>
              <div className="flex justify-start items-center gap-2 mt-2">
                <Button
                  onClick={() => handleVote(cont.id, true)}
                  disabled={cont.haveUpvoted}
                  variant="ghost"
                  size="sm"
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {cont.upvotes}
                </Button>
                {cont.haveUpvoted && (
                  <Button
                    onClick={() => handleVote(cont.id, false)}
                    variant="ghost"
                    size="sm"
                    className="hover:text-purple-400 transition-colors duration-300"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QueueList;
