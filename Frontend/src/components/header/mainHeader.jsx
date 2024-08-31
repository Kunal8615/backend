import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { API_URL } from '../../constant';

const MainHeader = () => {
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${API_URL}/users/current-user`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile image');
        }
        const data = await response.json();
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
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out');
    }
  };

  return (
    <div>
      <header className="shadow sticky z-50 top-0">
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div className="flex items-center lg:order-2">
              <button
                onClick={handleSignOut}
                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
              >
                Logout
              </button>
              {/* Profile Image */}
              {profileImage && (
                <div className="relative ml-4">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                </div>
              )}
            </div>
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `block py-2 pr-4 ${isActive ? 'text-orange-700' : 'text-gray-700'} pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tweet"
                    className={({ isActive }) =>
                      `block py-2 pr-4 ${isActive ? 'text-orange-700' : 'text-gray-700'} pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Tweet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/videolist"
                    className={({ isActive }) =>
                      `block py-2 pr-4 ${isActive ? 'text-orange-700' : 'text-gray-700'} pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/github"
                    className={({ isActive }) =>
                      `block py-2 pr-4 ${isActive ? 'text-orange-700' : 'text-gray-700'} pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Liked Videos
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default MainHeader;
