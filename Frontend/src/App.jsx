import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Homepage from './page/Homepage';
import UserProfile from './page/user';
import VideoPostForm from './page/upload_video';
import TweetList from "./page/Tweet"
import MainHeader from './components/header/mainHeader';
import VideoList from './page/all_videos';
import LikedVideosList from './page/Liked_video';
import Playlist from './page/Playlist';
import Search from './page/Search';
import RoadMap from './page/roadMap';
import RoadmapVideo from './page/roadmapVideo'; // ✅ Capitalized

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<MainHeader />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/videolist" element={<VideoList />} />
        <Route path="/likedvideos" element={<LikedVideosList />} />
        <Route path="/uploadvideo" element={<VideoPostForm />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/tubetweet/:title" element={<RoadmapVideo />} /> {/* ✅ Fixed */}
        <Route path="/tweet" element={<TweetList />} />
      </Routes>
    </Router>
  );
};

export default App;
