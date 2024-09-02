import React, { useState, useEffect } from 'react';
import { API_URL } from '../constant';

const LikedVideosList = () => {
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/like/all-liked-video`,
          {
            method : "GET",
            credentials : "include"
          }
        ); // Replace with your actual API endpoint
        const data = await response.json();
        
        if (data.success) {
          setLikedVideos(data.data);
        } else {
          console.error('Failed to fetch liked videos');
        }
      } catch (error) {
        console.error('Error fetching liked videos:', error);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="bg-black min-h-screen p-6">
      <h2 className="text-white text-2xl mb-6">Liked Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {likedVideos.map(video => (
          <div key={video.likedVideo._id} className="bg-slate-700 p-4 rounded-lg shadow-lg">
            <img 
              src={video.likedVideo.thumbnail} 
              alt={video.likedVideo.title} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-2">{video.likedVideo.title}</h3>
              <p className="text-sm text-gray-300">{video.likedVideo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideosList;
