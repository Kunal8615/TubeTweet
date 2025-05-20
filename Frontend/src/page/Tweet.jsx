import React, { useEffect, useState } from "react";
import { API_URL } from "../constant";
import MainHeader from "../components/header/mainHeader";

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [updateTweet, setUpdateTweet] = useState("");
  const [updateTweetId, setUpdateTweetId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [likeStatus, setLikeStatus] = useState({}); // Track likes/dislikes

  useEffect(() => {
    fetchTweets();
    fetchCurrentUser();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/getAll-tweet`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }
      const data = await response.json();
      // Sort tweets by createdAt in descending order to display latest first
      const sortedTweets = data.data.alltweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTweets(sortedTweets);
    } catch (err) {
      setError("Failed to fetch tweets");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/current-user`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCurrentUser(data.data.user);
    } catch (err) {
      setError("Failed to fetch user data");
    }
  };

  const handleCreateTweet = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/create-tweet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newTweet }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tweet");
      }
      await response.json();
      setNewTweet("");
      setIsCreating(false);
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to create tweet");
    }
  };

  const handleUpdateTweet = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/update/${updateTweetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: updateTweet }),
      });
      if (!response.ok) {
        throw new Error("Failed to update tweet");
      }
      await response.json();
      setUpdateTweet("");
      setUpdateTweetId(null);
      setIsUpdating(false);
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to update tweet");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const response = await fetch(`${API_URL}/tweet/delete-tweet/${tweetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tweet");
      }
      await response.json();
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to delete tweet");
    }
  };

  const handleEditClick = (tweet) => {
    if (tweet.user._id === currentUser._id) {
      setUpdateTweet(tweet.content);
      setUpdateTweetId(tweet._id);
      setIsUpdating(true);
    }
  };

  const handleLikeDislike = async (tweetId, action) => {
    try {
      const response = await fetch(`${API_URL}/like/toggle-tweet//${tweetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error("Failed to update like/dislike");
      }
      // Update local state to reflect the action
      const updatedLikeStatus = { ...likeStatus };
      updatedLikeStatus[tweetId] = action === 'like';
      setLikeStatus(updatedLikeStatus);
    } catch (err) {
      setError("Failed to update like/dislike");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 mx-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Recent Tweets
            </span>
          </h2>
          
          <div className="flex justify-between mb-8">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Create New Tweet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                    {tweet.user.avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">
                      {tweet.user.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(tweet.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-200 leading-relaxed mb-4">{tweet.content}</p>
                
                {currentUser && tweet.user._id === currentUser._id && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleEditClick(tweet)}
                      className="bg-yellow-500/80 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTweet(tweet._id)}
                      className="bg-red-500/80 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                {currentUser && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleLikeDislike(tweet._id, 'like')}
                      className={`bg-green-500/80 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all duration-300 ${likeStatus[tweet._id] === true ? 'ring-2 ring-green-500' : ''}`}
                    >
                      Like
                    </button>
                    <button
                      onClick={() => handleLikeDislike(tweet._id, 'dislike')}
                      className={`bg-red-500/80 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all duration-300 ${likeStatus[tweet._id] === false ? 'ring-2 ring-red-500' : ''}`}
                    >
                      Dislike
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create Tweet Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-white">Create Tweet</h2>
                <textarea
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl mb-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="What's happening?"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTweet}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Post Tweet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Tweet Modal - Similar styling as Create Modal */}
          {isUpdating && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-white">Update Tweet</h2>
                <textarea
                  value={updateTweet}
                  onChange={(e) => setUpdateTweet(e.target.value)}
                  className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-xl mb-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Update your tweet"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsUpdating(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTweet}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Update Tweet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TweetList;
