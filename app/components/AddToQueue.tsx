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
    setLoading(true);
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    // TODO: Add video to queue
    const response = await axios.post(
      "/api/streams",
      { url, creatorId: "9d65426b-b5cc-432a-927b-a037e7bef35c" },
      {
        withCredentials: true,
      }
    );
    if (response.data) {
      setQueue([...queue, response.data]);
      setLoading(false);
      toast({
        title: "Success",
        description: "Video added to queue",
      });
      setUrl("");
    }
    toast({
      title: "Error",
      description: "Error While Adding To Queue",
    });
    setLoading(false);
  };

  const handleShare = () => {
    const sharableLink = `${window.location.origin}/creator/${creatorId}`;
    navigator.clipboard.writeText(sharableLink).then(
      () => {
        toast.success("Link copied to the clipboard");
      },
      (err) => {
        toast.error("Could not copy the text", err);
      }
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
              {loading ? "Adding to queue" : "Add to Queue"}
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
        {url && url.match(YT_REGEX) && !loading && (
          <LiteYouTubeEmbed
            id={url.split("?v=")[1]}
            title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
          />
        )}
      </motion.form>
      <NowPlaying />
    </div>
  );
};

export default AddToQueue;
