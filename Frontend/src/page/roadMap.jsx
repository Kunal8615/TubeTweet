import React from 'react';
import MainHeader from '../components/header/mainHeader';
import Box from './roadBlock';
const RoadMap = () => {
  
  return (
    <>
    <MainHeader />
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Roadmap</h1>
      <div className="text-center mb-10">
           <p className="text-gray-300">Welcome to our roadmap pages </p>
      </div>
      <Box title="Fullstack" content="Learn to build complete web apps with both front-end and back-end technologies." />
      <Box title="WebDev" content="Master HTML, CSS, and JavaScript to create modern, responsive websites." />
      <Box title="Backend" content="Understand server-side development, databases, and API integration." />
      <Box title="MERN" content="Build full-stack apps with MongoDB, Express, React, and Node.js using JavaScript." />
    </div> 

    </>
  );
};

export default RoadMap;
