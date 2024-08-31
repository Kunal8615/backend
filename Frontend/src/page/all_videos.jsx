import React, { useState, useEffect } from 'react';
import VideoPlayer from './play_subs_video';
import { API_URL } from '../constant';
import MainHeader from '../components/header/mainHeader';


const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`${API_URL}/video/videoall-video`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setVideos(result.data); // Extract the `data` array from the response
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    return (
        <>
        <MainHeader/>
        <div className="p-4 bg-slate-800 min-h-screen">
            {selectedVideo ? (
                <VideoPlayer video={selectedVideo} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            className="video-item cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                            onClick={() => handleVideoClick(video)}
                            >
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-2">
                                <h3 className="text-lg font-semibold truncate">{video.title}</h3>
                                <p className="text-sm text-gray-600 truncate">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
                            </>
    );
};

export default VideoList;
