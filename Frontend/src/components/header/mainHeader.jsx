import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { API_URL } from '../../constant';

const MainHeader = () => {
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false); // New state for loading indicator
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
    setIsSigningOut(true); // Show loading indicator

    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      
      setTimeout(() => {
        navigate('/login');
      }, 1000); 
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out');
    } finally {
      setIsSigningOut(false); 
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="shadow sticky z-50 top-0 bg-slate-800 border-b-4 border-red-500">
      <nav className="px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl">
          
          <p className='text-yellow-300 text-2xl font-bold hover:text-orange-500 '>TubeTweet 🪬</p>
          <div className="flex items-center lg:order-2">
            <button
              onClick={handleSignOut}
              className="text-white hover:text-orange-400 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
              disabled={isSigningOut} 
            >
              {isSigningOut ? 'Signing Out...' : 'Signout'}
            </button>
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center p-2 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            type="button"
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <div
            className={`lg:flex font-bold lg:w-auto lg:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} lg:border-0 hover:text-orange-700`
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tweet"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} lg:border-0 hover:text-orange-700`
                  }
                >
                  Tweet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/videolist"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} lg:border-0 hover:text-orange-700`
                  }
                >
                  Videos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/likedvideos"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} lg:border-0 hover:text-orange-700`
                  }
                >
                  Liked Videos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/uploadvideo"
                  className={({ isActive }) =>
                    `block py-2 px-4 ${isActive ? 'text-orange-400' : 'text-white'} lg:border-0 hover:text-orange-700`
                  }
                >
                  Upload
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
