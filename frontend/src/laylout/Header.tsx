import React, { useState, useEffect } from 'react';
import { ArrowLeftEndOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import NotificationList from '../ui/notificationList';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserMe = async () => {
      const user = await authService.userMe();
      setUserEmail(user.email);
    };
    if (!userEmail) {
      getUserMe();
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  };

  return (
    <div>
      <header className="bg-white shadow-md p-4 flex justify-between items-center w-full px-8">
        <div className="flex items-center space-x-4 pl-4">
        <svg width="51" height="60" viewBox="0 0 51 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.0992 58.837V59.5151C35.0992 59.5283 35.0886 59.5389 35.0756 59.5389H24.0295C24.0165 59.5389 24.0059 59.5283 24.0059 59.5151V49.9906C24.0059 49.9775 24.0165 49.9668 24.0295 49.9668H33.2067C33.2197 49.9668 33.2303 49.9775 33.2303 49.9906V57.4718C33.2303 57.4849 33.2409 57.4956 33.254 57.4956H33.7674C34.5034 57.4956 35.0992 58.0965 35.0992 58.837Z" fill="blue"/>
          <path d="M22.0636 59.4304L21.683 59.9895C21.6757 60.0002 21.661 60.0026 21.6504 59.9953L12.5441 53.6978C12.5335 53.6904 12.5311 53.6757 12.5384 53.665L17.8907 45.8127C17.898 45.8021 17.9127 45.7996 17.9233 45.807L25.4892 51.0388C25.4998 51.0462 25.5022 51.061 25.4949 51.0717L21.291 57.2394C21.2836 57.25 21.2861 57.2648 21.2967 57.2722L21.7197 57.5645C22.3261 57.984 22.4801 58.8188 22.0636 59.4296V59.4304Z" fill="blue"/>
          <path d="M47.7639 34.2363C48.7517 35.2354 49.7403 36.2312 50.7322 37.2261C47.1771 41.6231 43.6252 46.0159 40.07 50.4087H8.68575C8.66701 50.3636 8.65234 50.3225 8.63359 50.2774C8.55535 50.0787 8.47792 49.8767 8.39968 49.6822C5.59843 42.5425 2.80125 35.3987 0 28.2558C2.3701 27.6869 4.7402 27.118 7.11438 26.549C6.57972 23.1816 6.04425 19.81 5.50959 16.4384C7.43794 16.9851 9.36548 17.5352 11.2898 18.0811L14.0763 4.34028C15.9599 6.91884 17.8434 9.49658 19.7269 12.071C20.9641 8.91289 22.1973 5.75476 23.4304 2.59662C24.6864 4.2467 25.9383 5.89349 27.1901 7.54357C28.3825 5.02905 29.5717 2.51452 30.764 0C32.8595 5.26876 34.9508 10.5375 37.0463 15.8022C38.3691 13.6505 39.691 11.4988 41.0138 9.34389C41.0587 13.4822 41.0994 17.6214 41.1442 21.7597C42.8533 20.3493 44.5625 18.9382 46.2708 17.5237C45.2006 21.3632 44.1305 25.2019 43.0644 29.0373C45.7092 28.6859 48.3548 28.3379 50.9995 27.9857C49.9221 30.07 48.8414 32.1544 47.7639 34.2346V34.2363Z" fill="black"/>
          <path d="M36.3136 28.0293C34.5825 28.0293 33.1709 29.4479 33.1709 31.1948C33.1709 32.9418 34.5825 34.3571 36.3136 34.3571C38.0448 34.3571 39.4564 32.9385 39.4564 31.1948C39.4564 29.4512 38.0448 28.0293 36.3136 28.0293ZM36.3136 33.6084C34.9909 33.6084 33.9134 32.5272 33.9134 31.1948C33.9134 29.8625 34.9909 28.7772 36.3136 28.7772C37.6364 28.7772 38.7139 29.8625 38.7139 31.1948C38.7139 32.5272 37.6364 33.6084 36.3136 33.6084Z" fill="white"/>
          <path d="M29.5265 28.0293C27.7913 28.0293 26.3838 29.4479 26.3838 31.1948C26.3838 32.9418 27.7922 34.3571 29.5265 34.3571C31.2609 34.3571 32.666 32.9385 32.666 31.1948C32.666 29.4512 31.2577 28.0293 29.5265 28.0293ZM29.5265 33.6084C28.2005 33.6084 27.1263 32.5272 27.1263 31.1948C27.1263 29.8625 28.1997 28.7772 29.5265 28.7772C30.8534 28.7772 31.9227 29.8625 31.9227 31.1948C31.9227 32.5272 30.8493 33.6084 29.5265 33.6084Z" fill="white"/>
          <path d="M29.6461 38.7785C28.3665 38.7785 27.2263 38.1217 26.668 37.0643L27.3241 36.7129C27.7462 37.5125 28.6575 38.0297 29.6461 38.0297C30.6347 38.0297 31.5467 37.5125 31.9689 36.7129L32.625 37.0643C32.0667 38.1217 30.9257 38.7785 29.6461 38.7785Z" fill="white"/>
        </svg>
        </div>

        <div className="flex items-center space-x-6">
          {/* User email */}
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            {userEmail}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative text-blue-500 focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded-lg overflow-hidden z-10">
                <div className="py-2">
                  {/* Use the NotificationList component */}
                  <NotificationList />
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </header>
      <div className="border-2 border-gray-150"></div>
    </div>
  );
};

export default Header;