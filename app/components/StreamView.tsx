"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import AddToQueue from "../components/AddToQueue";
import QueueList from "../components/QueueList";
import NowPlaying from "../components/NowPlaying";

const StreamView = ({ creatorId }: { creatorId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/streams/?creatorId=${creatorId}`, {
        withCredentials: true,
      });
      setData(response.data.streams);
    } catch (error) {
      console.error("Error refreshing stream:", error);
    }
  }, [creatorId]);

  useEffect(() => {
    if (!session?.user) {
      router.push("/");
      return;
    }

    fetchData();
    intervalRef.current = setInterval(fetchData, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session, router, fetchData]);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      <main className="container mx-auto py-12 px-4 text-center">
        <motion.h1
          className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Music Mingle
        </motion.h1>
        <motion.p
          className="text-2xl text-gray-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Start listening to your favorite playlist!
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 place-content-center">
          <AddToQueue />
          <QueueList creatorId={creatorId} />
        </div>
      </main>
    </div>
  );
};

export default StreamView;
