import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";
import CommentsList from "../components/Comment";

const VideoPlayer = ({ video }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // Fetch current user
        const getCurrentUser = await fetch(`${API_URL}/users/current-user`, {
          credentials: "include",
          method: "GET",
        });
        const getUser = await getCurrentUser.json();
        setUser(getUser.data);

        // Fetch user's playlists
        const playlistResponse = await fetch(
          `${API_URL}/playlist/user/${getUser.data._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const playlistData = await playlistResponse.json();
        setPlaylist(playlistData.data);
      } catch (error) {
        console.error("Error fetching user or playlist:", error);
      }
    };

    fetchPlaylist();
  }, [video.userId, video.id]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        // Fetch subscription status
        const subscriptionResponse = await fetch(
          `${API_URL}/subscription/toggle-subs/${user?._id}`
        );
        const subscriptionData = await subscriptionResponse.json();
        setIsSubscribed(subscriptionData.message);

        // Fetch like status
        const likeResponse = await fetch(
          `${API_URL}/like-status?videoId=${video.id}`
        );
        const likeData = await likeResponse.json();
        setIsLiked(likeData.isLiked);
      } catch (error) {
        console.error("Error fetching subscription or like status:", error);
      }
    };

    if (user) fetchStatuses();
  }, [video.userId, video.id, user]);

  const handleSubscribeToggle = async () => {
    const apiUrl = `${API_URL}/subscription/toggle-subs/${video.owner}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ userId: video.userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setIsSubscribed(!isSubscribed);
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleLikeToggle = async () => {
    const apiUrl = `${API_URL}/like/toggle-video/${video._id}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ videoId: video.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(!isLiked);
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Please select a playlist first");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/playlist/add/${video._id}/${selectedPlaylist._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Video added to playlist successfully!");
      } else {
        alert("Failed to add video to playlist.");
      }
    } catch (error) {
      console.error("Error adding video to playlist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Decorative Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content Area */}
      <div className="flex relative">
        {/* Left Side - Video and Info */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-6 border border-gray-700">
              <div className="aspect-video">
                <video
                  width="100%"
                  height="100%"
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src={video.videofile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-6 border border-gray-700">
              <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-300">
                        {video.owner?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-white">{video.owner}</p>
                      <p className="text-sm text-gray-400">{video.views} views</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSubscribeToggle}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      isSubscribed 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                  <button
                    onClick={handleLikeToggle}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      isLiked 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {isLiked ? "Liked" : "Like"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <CommentsList videoId={video} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Playlists */}
        <div className="w-80 bg-gray-800 shadow-2xl p-6 border-l border-gray-700">
          <div className="sticky top-6">
            <h3 className="text-xl font-bold text-white mb-4">Add to Playlist</h3>
            
            {playlist.length > 0 ? (
              <div className="space-y-4">
                <select
                  value={selectedPlaylist?._id || ""}
                  onChange={(e) =>
                    setSelectedPlaylist(
                      playlist.find((p) => p._id === e.target.value) || null
                    )
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                >
                  <option value="" disabled>Select a playlist</option>
                  {playlist.map((playlistItem) => (
                    <option key={playlistItem._id} value={playlistItem._id}>
                      {playlistItem.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddToPlaylist}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Playlist
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No playlists available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
