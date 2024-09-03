import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";
import CommentsList from "../components/Comment";

const VideoPlayer = ({ video }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
      
    
        const subscriptionResponse = await fetch(
          `${API_URL}/subscription/toggle-subs/${video.owner}`
        );
        const subscriptionData = await subscriptionResponse.json();
        setIsSubscribed(subscriptionData.message);

        // Fetch the current like status from the API
        const likeResponse = await fetch(
          `http://localhost:8000/api/v1/like-status?videoId=${video.id}`
        );
        const likeData = await likeResponse.json();
        setIsLiked(likeData.isLiked);
      } catch (error) {
        console.error("Error fetching subscription or like status:", error);
      }
    };

    fetchStatuses();
  }, [video.userId, video.id]);

  const handleSubscribeToggle = async () => {
    const apiUrl = isSubscribed
      ? `${API_URL}/subscription/toggle-subs/${video.owner}`
      : `${API_URL}/subscription/toggle-subs/${video.owner}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ userId: video.userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data.message);
      if (data.success) {
        setIsSubscribed(!isSubscribed);
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleLikeToggle = async () => {
    const apiUrl = isLiked
      ? `${API_URL}/like/toggle-video/${video._id}`
      : `${API_URL}/like/toggle-video/${video._id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ videoId: video.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data.message);
      if (data.success) {
        setIsLiked(!isLiked);
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="video-player p-6 bg-white rounded-xl shadow-lg">
      <div className="video-container mb-6">
        <video
          width="100%"
          height="auto"
          controls
          className="rounded-xl shadow-md"
        >
          <source src={video.videofile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{video.title}</h3>
      <p className="text-base text-gray-700 mb-5">{video.description}</p>
      <p className="text-base text-gray-700 mb-5">Views {video.views}</p>
      <p className="text-base text-gray-700 mb-5"> Owner id : {video.owner}</p>
      <div className="flex space-x-4">
        <button
          className="bg-red-500 text-white text-lg px-4 py-2 font-bold rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
          onClick={handleSubscribeToggle}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
        <button
          className="bg-blue-500 text-white text-lg font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          onClick={handleLikeToggle}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>

      <CommentsList videoId={video} />
    </div>
  );
};

export default VideoPlayer;
