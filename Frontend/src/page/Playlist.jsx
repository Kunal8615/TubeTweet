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
      <div className="bg-slate-800 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Your Playlists</h1>

        {/* Create New Playlist Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-3">Create New Playlist</h2>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Name</label>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm"
              placeholder="Enter playlist name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm">Description</label>
            <textarea
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm"
              placeholder="Enter playlist description"
            />
          </div>
          <button
            onClick={handleCreatePlaylist}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>

        <div className="flex flex-row space-x-6">
          {/* Playlists Section */}
          <div className="flex-1">
            {playlists.length === 0 ? (
              <p className="text-white">No playlists found.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist._id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden  transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist._id)}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">{playlist.name}</h2>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 mb-2">{playlist.description}</p>
                      <p className="text-gray-500">{playlist.videos.length} video(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos Section */}
          <div className="flex-2">
            {selectedPlaylist && (
              <div className="bg-slate-700 p-2 rounded-lg shadow-md  ">
                <h2 className="text-xl p-3 text-white font-semibold ">Videos in Playlist</h2>
                {videos.length === 0 ? (
                  <p className="text-gray-700">No videos found in this playlist.</p>
                ) : (
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                    {videos.map((video) => (
                      <div key={video._id} className="bg-gray-100  rounded-lg overflow-hidden shadow-md">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                          <p className="text-gray-600">{video.description}</p>
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
    </>
  );
}

export default Playlist;
