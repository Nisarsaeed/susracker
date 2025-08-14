'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiVideo, FiUsers, FiSettings, FiBarChart2, FiAlertCircle } from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { id: 1, name: 'Dashboard', icon: <FiHome size={20} />, path: '/' },
    // { id: 2, name: 'Live Cameras', icon: <FiVideo size={20} />, path: '/cameras' },
    { id: 3, name: 'Criminal Database', icon: <FiUsers size={20} />, path: '/criminals' },
    { id: 4, name: 'Alerts', icon: <FiAlertCircle size={20} />, path: '/alerts' },
    // { id: 5, name: 'Analytics', icon: <FiBarChart2 size={20} />, path: '/analytics' },
    { id: 6, name: 'Settings', icon: <FiSettings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="bg-primary-800 text-white w-16 md:w-64 flex flex-col shadow-lg">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <span className="hidden md:block text-xl font-bold">Susracker</span>
        <span className="block md:hidden text-xl font-bold">SR</span>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link 
                href={item.path} 
                className={`flex items-center py-3 px-4 ${
                  pathname === item.path 
                    ? ' bg-[#0369a1] text-white' 
                    : 'text-gray-300 hover:bg-#0369a1'
                } rounded-lg transition-colors duration-150`}
              >
                <span className="mr-4">{item.icon}</span>
                <span className="hidden md:block">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center mr-3">
            <span className="text-white font-medium">S</span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Security Admin</div>
            <div className="text-xs text-gray-300">admin@susracker.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;