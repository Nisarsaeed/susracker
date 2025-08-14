import React from 'react';
import { FiEye, FiEyeOff, FiAlertCircle, FiSettings } from 'react-icons/fi';
import Link from 'next/link';

const CameraCard = ({ camera, compact = false, onToggleStatus, onToggleDetection }) => {
  const { id, name, location, status, detectionEnabled } = camera;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'disabled':
        return 'bg-gray-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative">
        {/* Camera Feed */}
        <div className="bg-gray-900 aspect-video relative">
          {status === 'active' ? (
            <img 
              src={`/placeholder-imgs/camera${id % 3 + 1}.jpg`} 
              alt={`Camera ${name}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {status === 'maintenance' ? 'Under Maintenance' : 'Camera Disabled'}
              </span>
            </div>
          )}
          
          {/* Status indicator */}
          <div className="absolute top-2 left-2 flex items-center">
            <span className={`inline-block w-2 h-2 ${getStatusColor(status)} rounded-full mr-2`}></span>
            <span className="text-xs text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          
          {/* Detection status */}
          {status === 'active' && (
            <div className="absolute top-2 right-2">
              <button 
                onClick={onToggleDetection}
                className="text-white bg-black bg-opacity-50 p-1 rounded-full"
              >
                {detectionEnabled ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </button>
            </div>
          )}
          
          {/* Recording indicator */}
          {status === 'active' && (
            <div className="absolute bottom-2 left-2 flex items-center">
              <span className="inline-block w-3 h-3 bg-danger-500 rounded-full mr-1 animate-pulse"></span>
              <span className="text-xs text-white font-medium">REC</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          
          {!compact && (
            <div className="flex space-x-2">
              <button 
                onClick={onToggleStatus} 
                className="p-1 text-gray-500 hover:text-primary-600 rounded"
                title={status === 'active' ? 'Disable Camera' : 'Enable Camera'}
              >
                <FiSettings size={18} />
              </button>
              <Link 
                href={`/cameras/${id}`}
                className="p-1 text-gray-500 hover:text-primary-600 rounded"
                title="View details"
              >
                <FiEye size={18} />
              </Link>
            </div>
          )}
        </div>
        
        {!compact && detectionEnabled && status === 'active' && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <FiAlertCircle size={12} className="mr-1 text-primary-500" />
            Criminal detection active
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCard;