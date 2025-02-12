"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import type React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import axios from "axios";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YT_REGEX } from "../lib/db";
import NowPlaying from "./NowPlaying";

const creatorId = "9d65426b-b5cc-432a-927b-a037e7bef35c";

const AddToQueue = () => {
  const [url, setUrl] = useState("");
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/streams",
        { url, creatorId },
        { withCredentials: true }
      );

      if (response.data) {
        setQueue((prevQueue) => [...prevQueue, response.data]);
        toast.success("Video added to queue");
        setUrl("");
      } else {
        toast.error("Error While Adding To Queue");
      }
    } catch (error) {
      toast.error("Error While Adding To Queue");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const sharableLink = `${window.location.origin}/creator/${creatorId}`;
    navigator.clipboard.writeText(sharableLink).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Could not copy the link")
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto space-y-4 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex gap-2 items-center">
          <Input
            type="url"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-800/50 py-4 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <div className="flex gap-4">
            <Button
              disabled={loading}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Adding..." : "Add to Queue"}
            </Button>
            <Button
              onClick={handleShare}
              className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
            >
              <Share2 />
              Share
            </Button>
          </div>
        </div>

        {url.match(YT_REGEX) && !loading && (
          <LiteYouTubeEmbed
            id={url.split("?v=")[1]}
            title="YouTube Video Preview"
          />
        )}
      </motion.form>
    </div>
  );
};

export default AddToQueue;
