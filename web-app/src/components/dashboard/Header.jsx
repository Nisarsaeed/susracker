'use client';

import { useState } from 'react';
import { useDetection } from '@/context/DetectionContext';
import { AiOutlineBell, AiOutlineSearch, AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';

export default function Header({ toggleSidebar, sidebarOpen }) {
  const { activeAlerts, dismissAlert } = useDetection();
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? (
                <AiOutlineMenuFold className="h-6 w-6" />
              ) : (
                <AiOutlineMenuUnfold className="h-6 w-6" />
              )}
            </button>
            
            <div className="ml-6 flex items-center border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5">
              <AiOutlineSearch className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-200 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <AiOutlineBell className="h-6 w-6" />
                {activeAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 bg-danger-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                    {activeAlerts.length}
                  </span>
                )}
              </button>
              
              {alertsOpen && activeAlerts.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium">Alerts</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {activeAlerts.map((alert) => (
                      <div key={alert.id} className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-danger-600 dark:text-danger-400">
                            {alert.criminal?.name || 'Unknown Person'} Detected
                          </p>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Dismiss
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {alert.camera?.name || 'Unknown Camera'} - {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                        <div className="mt-2 flex items-center">
                          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
                            {alert.imageCapture ? (
                              <img
                                src={alert.imageCapture}
                                alt="Detection"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Confidence: {(alert.confidence * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Location: {alert.camera?.location || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}