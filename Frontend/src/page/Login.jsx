import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constant';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error('Login failed! Please check your credentials.');
      }

      console.log('Login successful:');
      navigate('/profile');
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-400/30">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition duration-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
