import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import type Tab from '../types/tab.type';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      useAuthStore.getState().logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const [active, setActive] = useState<number>(0);
  const tabs: Tab[] = [
    {
      icon: (
        <path d="M2.25 12L12 3l9.75 9H18v7.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12H2.25z" />
      )
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      )
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      )
    }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-900 px-4 flex justify-between items-center text-base">
      <Link to="/">
        <div className="min-w-[150px] font-bold cursor-pointer">CloneBook</div>
      </Link>

      <div className="w-[360px] min-w-[150px] flex items-center">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={`group w-[120px] h-[64px] flex justify-center items-center cursor-pointer transition-colors duration-300 border-b-2 ${active === i ? 'border-[#1877F2]' : 'border-transparent'
              }`}
            onClick={() => setActive(i)}
          >
            <div className="flex justify-center items-center group-hover:bg-neutral-700/50 w-[120px] h-12 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 transition-colors duration-300 ${active === i ? 'text-[#1877F2]' : 'text-neutral-400'
                  }`}
              >
                {tab.icon}
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="min-w-[100px] w-[150px] flex justify-end relative">
        <div className="relative group w-12 h-12">
          {/* Profile Icon (default) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-neutral-400 cursor-pointer transition-opacity opacity-100 group-hover:opacity-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
        0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 
        9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <div className="w-10 h-10 absolute inset-1 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
              onClick={handleLogout}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>

            {/* Tooltip */}
            <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Logout
            </span>
          </div>


        </div>
      </div>

    </header >
  )
}

export default Header