'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  AiOutlineDashboard, 
  AiOutlineVideoCamera, 
  AiOutlineUser, 
  AiOutlineBarChart, 
  AiOutlineSetting, 
  AiOutlineLogout
} from 'react-icons/ai';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    return pathname === path ? 'bg-#0369a1 text-white' : 'text-gray-300 hover:bg-primary-800 hover:text-white';
  };

  const navItems = [
    { href: '/dashboard', icon: <AiOutlineDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { href: '/dashboard/cameras', icon: <AiOutlineVideoCamera className="w-5 h-5" />, label: 'Cameras' },
    { href: '/dashboard/criminals', icon: <AiOutlineUser className="w-5 h-5" />, label: 'Criminals' },
    { href: '/dashboard/analytics', icon: <AiOutlineBarChart className="w-5 h-5" />, label: 'Analytics' },
    { href: '/dashboard/settings', icon: <AiOutlineSetting className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full bg-primary-900 w-64 text-white py-6">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold">CrimeSight</h1>
        <p className="text-sm text-gray-400">Real-time detection system</p>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive(item.href)}`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="px-4 pt-4 pb-2 border-t border-gray-700 ">
        <div className="flex items-center">
          <div className="bg-#0369a1 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-xl font-medium">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'Role'}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="mt-4 flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-gray-300 hover:bg-primary-800 hover:text-white"
        >
          <AiOutlineLogout className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}