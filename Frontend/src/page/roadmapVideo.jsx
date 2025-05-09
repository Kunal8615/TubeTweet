import React, { useState, useEffect } from "react";
import MainHeader from "../components/header/mainHeader";
import { useParams } from "react-router-dom";
import VideoPlayer from "./play_subs_video";
import { API_URL } from "../constant.js";

const RoadmapVideo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const {title} = useParams();
   

    useEffect(() => {
        fetchVideos();
    }, [title]);

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/video/search?query=${title}`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);
            if (result.statuscode === 200) {
                setVideos(result.data);
            } else {
                setVideos([]);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    return (
        <>
            <MainHeader/>
            <div className="w-full p-4 bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-white">Videos for {title}</h1>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="relative">
                                <div className="absolute top-0 left-0 w-12 h-12 bg-white rounded-full animate-pulse"></div>
                                <div className="absolute top-0 left-12 w-12 h-12 bg-white rounded-full animate-pulse animation-delay-200"></div>
                                <div className="absolute top-0 left-24 w-12 h-12 bg-white rounded-full animate-pulse animation-delay-400"></div>
                            </div>
                        </div>
                    ) : selectedVideo ? (
                        <VideoPlayer video={selectedVideo} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="video-item cursor-pointer bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                                    onClick={() => handleVideoClick(video)}
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-2">
                                        <h3 className="text-lg font-semibold truncate text-white">{video.title}</h3>
                                        <p className="text-sm text-gray-300 truncate">Description: {video.description}</p>
                                        <p className="text-sm text-blue-400 font-bold truncate">Views: {video.views}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RoadmapVideo;
