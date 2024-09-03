import React, { useState } from "react";

const VideoCard = ({ video }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div
        className="bg-gray-800 text-white rounded-lg shadow-lg w-64 h-64 overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={openModal}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-36 object-cover"
        />
        <div className="p-4 flex flex-col  h-40">
          <h2 className="text-lg font-semibold truncate">{video.title}</h2>
          <p className="text-sm font-semibold truncate text-orange-400">
            {" "}
            Views: {video.views}
          </p>
          <p className="text-sm text-gray-400 overflow-hidden line-clamp-2"> Description : 
            {" "} {  video.description}
          </p>
          <p className="text-sm text-slate-50 "> Upload :   
            - {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Modal for video playback */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-xl">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <video
              src={video.videofile}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
