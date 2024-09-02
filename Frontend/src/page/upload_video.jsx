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
    <div className="flex flex-col border-2  border-slate-600 items-center p-8 bg-slate-900 min-h-screen">
      <h1 className="text-2xl   text-orange-400 font-bold mb-4">Post a Video</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-md w-full max-w-lg"
      >
        <div className="mb-4 ">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">
            Video File:
          </label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:py-2 file:px-4 file:rounded-md file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail File:
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:py-2 file:px-4 file:rounded-md file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? <ReactLoading type='bars' color="#fff" /> : 'Post Video'}
        </button>
      </form>
      {responseMessage && (
          <p className="mt-4 text-lg font-semibold text-green-600">{responseMessage}</p>
        )}
    </div>
        </>
  );
};

export default VideoPostForm;
