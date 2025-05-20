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


    <>
   
      <MainHeader />
    <div className="bg-slate-900 min-h-screen p-4 text-white">
      
      {/* Search Bar with improved styling */}
      <div className="max-w-3xl mx-auto mb-8 mt-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for videos..."
            className="w-full pl-12 p-4 border-2 border-gray-600 rounded-xl text-black bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Loading State with animation */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Video Grid with improved spacing and hover effects */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="transform hover:scale-105 transition-transform duration-300">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>

      {/* No Results Message with better styling */}
      {!isLoading && videos.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No videos found for "<span className="text-blue-400">{query}</span>"
          </p>
          <p className="text-gray-500 mt-2">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
    </>
  );
}

export default Search;
