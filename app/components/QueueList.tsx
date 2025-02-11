"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";

export interface Video {
  id: string;
  title: string;
  smallImg: string;
  bigImg: string;
  upvotes: number;
  url: string;
  haveUpvoted: boolean;
}

const QueueList = ({ creatorId }: { creatorId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (!session?.user) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/streams?creatorId=${creatorId}`,
          {
            withCredentials: true,
          }
        );
        setVideos(response.data.streams.sort((a:any,b:any) => a.upvotes < b.upvotes ? -1 : 1));
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [session?.user, creatorId, router]);

  const handleVote = useCallback(
    debounce(async (streamId: string, isUpvote: boolean) => {
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

      try {
        await axios.post(
          `/api/streams/${isUpvote ? "upvotes" : "downvotes"}`,
          { streamId },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error updating vote:", error);
        // Rollback state in case of error
        setVideos((prev) =>
          prev.map((video) =>
            video.id === streamId
              ? {
                  ...video,
                  upvotes: isUpvote ? video.upvotes - 1 : video.upvotes + 1,
                  haveUpvoted: !isUpvote,
                }
              : video
          )
        );
      }
    }, 300),
    []
  );

  return (
    <motion.div className="w-full max-w-3xl mx-auto p-6 space-y-6 border-l border-purple-900">
      <h2 className="text-2xl font-bold mb-6 text-purple-300">Up Next</h2>
      <div className="space-y-4">
        {videos.map((cont) => (
          <motion.div
            key={cont.id}
            className="flex justify-start items-center gap-4 p-4 bg-gray-800/30 rounded-lg"
          >
            <Link href={cont.url}>
              <img
                src={cont.smallImg}
                alt={cont.title}
                className="w-24 h-16 object-cover rounded-md"
              />
            </Link>
            <div>
              <h3 className="font-medium text-sm text-wrap text-start truncate max-w-[36rem] text-gray-200">
                {cont.title}
              </h3>
              <div className="flex gap-2">
                <Button
                  disabled={cont.haveUpvoted === true}
                  className="mt-2 bg-transparent flex items-center gap-1"
                  onClick={() => handleVote(cont.id, true)}
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      cont.haveUpvoted === true
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  {cont.upvotes}
                </Button>
                <Button
                  disabled={cont.haveUpvoted === false}
                  className="mt-2 bg-transparent flex items-center gap-1"
                  onClick={() => handleVote(cont.id, false)}
                >
                  <ThumbsDown
                    className={`h-4 w-4 ${
                      cont.haveUpvoted === false
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QueueList;
