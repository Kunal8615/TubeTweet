import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import VideoPlayer from './play_subs_video';
import { API_URL } from '../constant';
import MainHeader from '../components/header/mainHeader';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideosWithUserDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/video/videoall-video`, {
                    withCredentials: true, // Ensures cookies are sent
                });

                const videosWithUserDetails = await Promise.all(
                    response.data.data.map(async (video) => {
                        const userResponse = await axios.get(`${API_URL}/video/get-user-by-video-id/${video._id}`, {
                            withCredentials: true,
                        });
                        return { ...video, user: userResponse.data.data };
                    })
                );

                // Sort videos by upload date in descending order (latest first)
                const sortedVideos = videosWithUserDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setVideos(sortedVideos);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos or user details:', error);
                setLoading(false);
            }
        };

        fetchVideosWithUserDetails();
    }, []);

    const fetchviews = async (videoId) => {
        try {
            const response = await axios.get(`${API_URL}/video/video-by-id/${videoId}`, {
                withCredentials: true,
            });

            // Update the video list with the updated views count
            setVideos((prevVideos) => 
                prevVideos.map((video) =>
                    video._id === response.data.data._id ? response.data.data : video
                )
            );
        } catch (error) {
            console.error('Error fetching video views:', error);
        }
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        fetchviews(video._id); 
    };

    return (
        <>
            <MainHeader />
            <div className="p-4 bg-slate-800 min-h-screen">
                {loading ? (
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
                                className="video-item cursor-pointer bg-slate-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                                onClick={() => handleVideoClick(video)}
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-2">
                                    <h3 className="text-lg font-semibold truncate">{video.title}</h3>
                                    <p className="text-sm text-gray-800 truncate">Description: {video.description}</p>
                                    <p className="text-sm text-blue-800 font-bold truncate">Owner: {video.user.username}</p>
                                    <p className="text-sm text-blue-800 font-bold truncate">Views: {video.views}</p>
                                </div> 
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default VideoList;
