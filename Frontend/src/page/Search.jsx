import React, { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import { API_URL } from "../constant.js";
import MainHeader from "../components/header/mainHeader";

function Search() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (query.trim()) {
      fetchVideos();
    } else {
      setVideos([]); 
    }
  }, [query]);


  const fetchVideos = async () => {
    setIsLoading(true);
    try {
        console.log(`${API_URL}/video/search?query=${ query } `);
      const response = await fetch(`${API_URL}/video/search?query=${ query } `,{
        method : "GET",
        credentials: "include", 
        
    
      });
      const result = await response.json();
      console.log(result);
      if (result.statuscode == 200) {
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

  return (
    <div className="bg-slate-900 min-h-screen p-4 text-white">
      <MainHeader />
      {/* Search Bar */}
      <div className="mb-4 mt-5">
        <input
          type="text"
          placeholder="Search for videos..."
          className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading && <p className="text-gray-500">Loading...</p>}

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

     
      {!isLoading && videos.length === 0 && query && (
        <p className="text-gray-500">No videos found for "{query}"</p>
      )}
    </div>
  );
}

export default Search;
