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
    <div className="video-player p-6 bg-white rounded-xl shadow-lg">
      <div className="video-container mb-6">
        <video
          width="100%"
          height="auto"
          controls
          className="rounded-xl shadow-md"
        >
          <source src={video.videofile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{video.title}</h3>
      <p className="text-base text-gray-700 mb-5">{video.description}</p>
      <p className="text-base text-gray-700 mb-5">Views: {video.views}</p>
      <p className="text-base text-gray-700 mb-5">Owner id: {video.owner}</p>

      <div className="flex space-x-4">
        <button
          className="bg-red-500 text-white text-lg px-4 py-2 font-bold rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
          onClick={handleSubscribeToggle}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
        <button
          className="bg-blue-500 text-white text-lg font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          onClick={handleLikeToggle}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>

      <div className="playlists mb-5">
        <h4 className="text-lg font-bold text-gray-800 mb-3">Playlists:</h4>
        {playlist.length > 0 ? (
          <div>
            <select
              value={selectedPlaylist?._id || ""}
              onChange={(e) =>
                setSelectedPlaylist(
                  playlist.find((p) => p._id === e.target.value) || null
                )
              }
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="" disabled>Select Playlist</option>
              {playlist.map((playlistItem) => (
                <option key={playlistItem._id} value={playlistItem._id}>
                  {playlistItem.name}
                </option>
              ))}
            </select>
            <button
              className="bg-green-500 text-white text-lg px-4 py-2 font-bold rounded-lg hover:bg-green-600 ml-4"
              onClick={handleAddToPlaylist}
            >
              Add to Playlist
            </button>
          </div>
        ) : (
          <p className="text-base text-gray-700">No playlists available</p>
        )}
      </div>

      <CommentsList videoId={video} />
    </div>
  );
};

export default VideoPlayer;
