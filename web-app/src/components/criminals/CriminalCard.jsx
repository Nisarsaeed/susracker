import React from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiCalendar, FiMapPin } from 'react-icons/fi';

const CriminalCard = ({ criminal, onDelete }) => {
  const { _id, name, age, status, crimes, threat, image, last_seen_date,last_seen_location } = criminal;
  console.log(crimes)
  
  // Return appropriate badge classes based on threat level
  const getThreatBadgeColor = (threat) => {
    switch (threat) {
      case 'high':
        return 'bg-danger-100 text-danger-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Return appropriate badge classes based on criminal status
  const getStatusBadgeColor = (status) => {
    return status === 'wanted' 
      ? 'bg-danger-100 text-danger-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover object-center"
        />
        
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getThreatBadgeColor(threat)}`}>
            {threat.charAt(0).toUpperCase() + threat.slice(1)} Threat
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        
        <div className="text-sm text-gray-500 mb-3">
          <span>{age} years old</span>
          <span className="mx-2">•</span>
          <span>{crimes.join(', ')}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
  <FiCalendar size={12} className="mr-1" />
  <span>
    {last_seen_date
      ? new Date(last_seen_date).toLocaleString()
      : 'Unknown'}
  </span>
</div>

<div className="flex items-center text-xs text-gray-500 mb-4">
  <FiMapPin size={12} className="mr-1" />
  <span>{last_seen_location || 'Unknown' }</span>
</div>

        
        <div className="flex justify-between mt-4">
          <Link
            href={`/criminals/${_id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View <br/> Details
          </Link>
          
          <div className="flex space-x-1">
            <button 
              className={`p-1 rounded text-xs ${
                status === 'wanted' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-danger-100 text-danger-800 hover:bg-danger-200'
              }`}
              title={status} 
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
            
            <Link 
              href={`/criminals/edit/${_id}`}
              className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Edit Criminal Record"
            >
              <FiEdit2 size={14} className=' inline '/>
            </Link>
            
            <button 
              onClick={() => onDelete(_id)}
              className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              title="Delete Criminal Record"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriminalCard;
