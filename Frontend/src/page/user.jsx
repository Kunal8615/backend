import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";
import VideoCard from "../components/VideoCard";
import MainHeader from "../components/header/mainHeader";

const UserProfile = () => {
  const [profileImages, setProfileImages] = useState({
    backgroundImage: "https://via.placeholder.com/800x300", // Fallback cover image
    profileImage: "https://via.placeholder.com/128", // Fallback profile image
    userid: "",
  });

  const [user, setUser] = useState({
    subscriber: "0",
    channel_subs: "0",
    userid: "",
    Totalview: "",
  });

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        const response = await fetch(`${API_URL}/users/current-user`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.data) {
          setProfileImages({
            backgroundImage: data.data.coverimage,
            profileImage: data.data.avatar,
            userid: data.data._id,
          });

          fetchUserStats(data.data._id);
          fetchVideos(data.data._id);
        }
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };

    const fetchUserStats = async (channelId) => {
      try {
        const response = await fetch(`${API_URL}/dashboard/stats/${channelId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.data) {
          setUser({
            subscriber: data.data.totalNumberOfSubscribers,
            channel_subs: data.data.totalNumberOfVideos,
            userid: channelId,
            Totalview: data.data.totalNumberOfViews,
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchVideos = async (channelId) => {
      try {
        const response = await fetch(`${API_URL}/video/all-videos/${channelId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.data) {
          setVideos(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    };

    fetchProfileImages();
  }, []);

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm("Are you sure you want to delete this video?");
    if (confirmed) {
      try {
        const response = await fetch(`${API_URL}/video/delete-video/${videoId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete video");
        }

        // Update the video list after deletion
        setVideos(videos.filter((video) => video._id !== videoId));
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  return (<>
    <MainHeader/>
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Profile header */}
      <div className="relative">
        <img
          src={profileImages.backgroundImage}
          alt="Background"
          className="w-full h-60 object-cover"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={profileImages.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* User stats */}
      <div className="bg-gray-900 text-white flex items-center justify-center pt-2">
  <div className="flex space-x-6">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
      <h3 className="text-xl font-medium mb-2">Subscriber </h3>
      <p className="text-3xl font-semibold text-teal-400">{user.subscriber}</p>
    </div>
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
      <h3 className="text-xl font-medium mb-2">Total Videos</h3>
      <p className="text-3xl font-semibold text-purple-400">{user.channel_subs}</p>
    </div>
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105">
      <h3 className="text-xl font-medium mb-2">Total Views</h3>
      <p className="text-3xl font-semibold text-pink-400">{user.Totalview}</p>
    </div>
  </div>
</div>

      {/* Video segment */}
      <div className="bg-gray-900 min-h-screen p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-6">Videos</h1>
          <div className="flex flex-wrap -m-4">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video._id} className="p-4 relative">
                  <VideoCard video={video} />
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-white">No videos available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
                </>
  );
};

export default UserProfile;
