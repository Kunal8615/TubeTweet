import React, { useEffect, useState } from 'react';
import { API_URL } from '../constant';
import MainHeader from '../components/header/mainHeader';

function Playlist() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`${API_URL}/users/current-user`, {
          method: "GET",
          credentials: 'include'
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData.data);

        const playlistsResponse = await fetch(`${API_URL}/playlist/user/${userData.data._id}`, {
          credentials: "include",
          method: "GET"
        });
        if (!playlistsResponse.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName || !newPlaylistDescription) {
      setError('Please fill in both fields');
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/playlist/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDescription,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPlaylists([...playlists, data.data]);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
      } else {
        console.error('Error creating playlist:', data.message);
        setError('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    try {
        // Fetch the playlist details
        const playlistResponse = await fetch(`${API_URL}/playlist/video-playlist/${playlistId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!playlistResponse.ok) {
            throw new Error('Failed to fetch playlist details');
        }

        const playlistData = await playlistResponse.json();
        setSelectedPlaylist(playlistData.data);

        // Extract video IDs from the playlist data
        const videoDetails = playlistData.data; // Array of video objects

        // Check if there are videos in the playlist
        if (videoDetails && videoDetails.length > 0) {
            // Fetch detailed information for each video using the `_id` field
            const videoDetailsPromises = videoDetails.map(video =>
                fetch(`${API_URL}/video/video-by-id/${video._id}`, {
                    method: 'GET',
                    credentials: 'include',
                }).then(response => {
                    if (!response) {
                        throw new Error(`Failed to fetch details for video ID ${video._id}`);
                    }
                    return response.json();
                })
            );

            const videoDetailsResponses = await Promise.all(videoDetailsPromises);
            // Extract video data from responses
            const videos = videoDetailsResponses.map(response => response.data);
            setVideos(videos);
        } else {
            // No videos in the playlist
            setVideos(["no videos"]);
        }
    } catch (error) {
        console.error('Error fetching playlist details:', error);
       
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <>
      <MainHeader />
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Your Playlists
          </h1>

          {/* Create New Playlist Form */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl mb-8 max-w-md mx-auto border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">Create New Playlist</h2>
            {error && <p className="text-red-400 mb-4 bg-red-500/10 p-3 rounded-lg">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter playlist name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter playlist description"
                  rows="3"
                />
              </div>
              <button
                onClick={handleCreatePlaylist}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : 'Create Playlist'}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Playlists Section */}
            <div className="flex-1">
              {playlists.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No playlists found. Create your first playlist!</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {playlists.map((playlist) => (
                    <div 
                      key={playlist._id} 
                      className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
                      onClick={() => handlePlaylistClick(playlist._id)}
                    >
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{playlist.name}</h2>
                        <p className="text-gray-300 mb-4">{playlist.description}</p>
                        <div className="flex items-center text-gray-400">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {playlist.videos.length} video(s)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div className="lg:w-1/2">
              {selectedPlaylist && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Videos in Playlist
                  </h2>
                  {videos.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No videos found in this playlist.</p>
                  ) : (
                    <div className="grid gap-6 grid-cols-1">
                      {videos.map((video) => (
                        <div key={video._id} className="bg-white/5 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="aspect-video relative">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                            <p className="text-gray-300 text-sm line-clamp-2">{video.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Playlist;
