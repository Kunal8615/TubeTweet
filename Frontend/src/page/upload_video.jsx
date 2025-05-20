import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import { API_URL } from '../constant';
import MainHeader from '../components/header/mainHeader';

const VideoPostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.name === 'video') {
      setVideoFile(e.target.files[0]);
    } else if (e.target.name === 'thumbnail') {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('videofile', videoFile);
      formData.append('thumbnail', thumbnailFile);

      const response = await fetch(`${API_URL}/video/`, {
        credentials : 'include',
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message);
        console.log('Video posted successfully:', result.data);
      } else {
        throw new Error(result.message || 'Error posting video');
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (error) {
      setResponseMessage(error.message);
      console.error('Error posting video:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainHeader/>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Upload Your Video
            </h1>
            <p className="mt-2 text-gray-400">Share your content with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                  Video Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your video title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Describe your video content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-gray-200">
                    Video File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-400">
                        <input
                          type="file"
                          id="video"
                          name="video"
                          accept="video/*"
                          onChange={handleFileChange}
                          required
                          className="sr-only"
                        />
                        <label htmlFor="video" className="relative cursor-pointer rounded-md font-medium text-orange-500 hover:text-orange-400">
                          <span>Upload a video</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">MP4, MOV up to 100MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-200">
                    Thumbnail
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-400">
                        <input
                          type="file"
                          id="thumbnail"
                          name="thumbnail"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="sr-only"
                        />
                        <label htmlFor="thumbnail" className="relative cursor-pointer rounded-md font-medium text-orange-500 hover:text-orange-400">
                          <span>Upload a thumbnail</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <ReactLoading type="bars" color="#fff" height={24} width={24} />
                ) : (
                  'Upload Video'
                )}
              </button>
            </div>
          </form>

          {responseMessage && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-center text-green-400 font-medium">{responseMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoPostForm;
