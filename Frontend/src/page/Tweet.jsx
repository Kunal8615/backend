import React, { useEffect, useState } from "react";
import { API_URL } from "../constant";
import MainHeader from "../components/header/mainHeader";

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [updateTweet, setUpdateTweet] = useState("");
  const [updateTweetId, setUpdateTweetId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTweets();
    fetchCurrentUser();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/getAll-tweet`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }
      const data = await response.json();
      // Sort tweets by createdAt in descending order to display latest first
      const sortedTweets = data.data.alltweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTweets(sortedTweets);
    } catch (err) {
      setError("Failed to fetch tweets");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/current-user`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCurrentUser(data.data.user);
    } catch (err) {
      setError("Failed to fetch user data");
    }
  };

  const handleCreateTweet = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/create-tweet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newTweet }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tweet");
      }
      await response.json();
      setNewTweet("");
      setIsCreating(false);
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to create tweet");
    }
  };

  const handleUpdateTweet = async () => {
    try {
      const response = await fetch(`${API_URL}/tweet/update/${updateTweetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: updateTweet }),
      });
      if (!response.ok) {
        throw new Error("Failed to update tweet");
      }
      await response.json();
      setUpdateTweet("");
      setUpdateTweetId(null);
      setIsUpdating(false);
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to update tweet");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const response = await fetch(`${API_URL}/tweet/delete-tweet/${tweetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tweet");
      }
      await response.json();
      fetchTweets(); // Refresh the tweet list
    } catch (err) {
      setError("Failed to delete tweet");
    }
  };

  const handleEditClick = (tweet) => {
    if (tweet.user._id === currentUser._id) {
      setUpdateTweet(tweet.content);
      setUpdateTweetId(tweet._id);
      setIsUpdating(true);
    }
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <MainHeader />
      <div className="bg-black p-6    mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Recent Tweets</h2>
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-purple-600 font-semibold text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Create Tweet
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-white border hover:bg-blue-200 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {tweet.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    {tweet.user.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{tweet.content}</p>
              {currentUser && tweet.user._id === currentUser._id && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(tweet)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                  >
                    Edit Tweet
                  </button>
                  <button
                    onClick={() => handleDeleteTweet(tweet._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Delete Tweet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Tweet Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Create Tweet</h2>
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                rows="4"
                placeholder="What's happening?"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsCreating(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTweet}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Post Tweet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Tweet Modal */}
        {isUpdating && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Update Tweet</h2>
              <textarea
                value={updateTweet}
                onChange={(e) => setUpdateTweet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                rows="4"
                placeholder="Update tweet content"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsUpdating(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTweet}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                >
                  Update Tweet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TweetList;
