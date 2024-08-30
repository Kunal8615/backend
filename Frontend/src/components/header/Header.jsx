import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { API_URL } from '../../constant';

const Header = () => {
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${API_URL}/users/current-user`,{
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile image');
        }
        const data = await response.json();
       console.log(data);
        setProfileImage(data.data.avatar);
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setError('Error fetching profile image');
      }
    };

    fetchProfileImage();
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      // Optionally notify the server (depends on your implementation)
      const response = await fetch(`${API_URL}/users/logout`,{
        method: "POST",
        credentials : "include"
      });
       console.log( response);
      if (!response) {
        throw new Error('Failed to sign out');
      }

      navigate('/login');
      // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out');
    }
  };
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="p-2 rounded-md bg-gray-700 text-white border border-gray-600"
      />
      
      {/* Profile and Sign Out Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
        <div className="ml-4">

        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white"></div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;
