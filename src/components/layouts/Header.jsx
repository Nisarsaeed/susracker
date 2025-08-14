'use client'
import {useSocket} from '../../contexts/SocketContext.js'
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import Link from 'next/link.js';
import { useRouter } from 'next/navigation.js';

const Header = () => {
  const { unreadCount } = useSocket();
  const router = useRouter()

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center md:hidden">
          <button 
            className="text-gray-600 hover:text-primary-600 focus:outline-none"
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
        </div>

        <div className="flex-1 max-w-xl mx-auto md:mx-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for criminals, alerts, or cameras..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button className="relative p-2 text-gray-600 hover:text-primary-600 focus:outline-none cursor-pointer"
            href="/alerts" onClick={()=>router.push('/alerts')}>
            <FiBell size={20} />
            { unreadCount >0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;