"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play } from "lucide-react"

// Note: In a real application, you'd need to set up an API key for the YouTube Data API
const API_KEY = "YOUR_YOUTUBE_API_KEY"

interface Video {
  id: string
  title: string
  votes: number
  thumbnail: string
}
const Dashboard = () => {
    const [inputUrl, setInputUrl] = useState("")
    const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
    const [queue, setQueue] = useState<Video[]>([])
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  
    useEffect(() => {
      // Load the YouTube IFrame Player API
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }, [])
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputUrl(e.target.value)
      // Extract video ID from URL
      const videoId = extractVideoId(e.target.value)
      if (videoId) {
        fetchVideoDetails(videoId)
      } else {
        setPreviewVideo(null)
      }
    }
  
    const extractVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      const match = url.match(regex)
      return match ? match[1] : null
    }
  
    const fetchVideoDetails = async (videoId: string) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`,
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          setPreviewVideo({
            id: videoId,
            title: data.items[0].snippet.title,
            votes: 0,
            thumbnail: data.items[0].snippet.thumbnails.default.url,
          })
        }
      } catch (error) {
        console.error("Error fetching video details:", error)
      }
    }
  
    const addToQueue = () => {
      if (previewVideo) {
        setQueue([...queue, previewVideo])
        setInputUrl("")
        setPreviewVideo(null)
      }
    }
  
    const handleVote = (index: number, increment: number) => {
      const newQueue = [...queue]
      newQueue[index].votes += increment
      newQueue.sort((a, b) => b.votes - a.votes)
      setQueue(newQueue)
    }
  
    const playNext = () => {
      if (queue.length > 0) {
        setCurrentVideo(queue[0].id)
        setQueue(queue.slice(1))
      }
    }
  
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">YouTube Voting Queue</h1>
  
        {/* Input for YouTube URL */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Enter YouTube URL"
            value={inputUrl}
            onChange={handleInputChange}
            className="bg-gray-800 text-white mb-4"
          />
          {previewVideo && (
            <Card className="bg-gray-800 mb-4">
              <CardContent className="p-4 flex items-center">
                <img
                  src={previewVideo.thumbnail || "/placeholder.svg"}
                  alt={previewVideo.title}
                  className="w-24 h-18 object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{previewVideo.title}</h3>
                  <Button onClick={addToQueue} className="mt-2">
                    Add to Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
  
        {/* Queue */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Queue</h2>
          {queue.map((video, index) => (
            <Card key={video.id} className="bg-gray-800 mb-4">
              <CardContent className="p-4 flex items-center">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-24 h-18 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{video.title}</h3>
                  <div className="flex items-center mt-2">
                    <Button onClick={() => handleVote(index, 1)} variant="ghost" size="sm" className="px-2">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{video.votes > 0 ? `+${video.votes}` : video.votes}</span>
                    </Button>
                    <Button onClick={() => handleVote(index, -1)} variant="ghost" size="sm" className="px-2 ml-2">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span>{video.votes < 0 ? video.votes : ""}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {queue.length === 0 && <p>The queue is empty</p>}
        </div>
  
        {/* YouTube Player */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Now Playing</h2>
          {currentVideo ? (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>No video is currently playing</p>
          )}
        </div>
  
        <Button onClick={playNext} className="flex items-center bg-white text-black">
          <Play className="mr-2 h-4 w-4" /> Play Next
        </Button>
      </div>
    )
}

export default Dashboard