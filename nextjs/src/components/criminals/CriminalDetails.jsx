'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiArrowLeft, FiClock, FiMap, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
// import { format } from 'date-fns';

const CriminalDetails = ({ criminal, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  if (!criminal) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Criminal details not found.</p>
        <Link href="/criminals" className="mt-4 inline-block text-primary-600 hover:text-#0369a1">
          Back to Criminals List
        </Link>
      </div>
    );
  }
  const { _id, name, age, gender, height, weight, lastSeen, lastLocation, crimes, threat, status, notes } = criminal;
  
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
  
  const getStatusBadgeColor = (status) => {
    return status === 'wanted' 
      ? 'bg-danger-100 text-danger-800 border-danger-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };
  
  const handleConfirmDelete = () => {
    console.log('Deleting', _id);
    onDelete(_id);
    setShowConfirmDelete(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with actions */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href="/criminals" className="flex items-center text-gray-600 hover:text-primary-600">
          <FiArrowLeft size={16} className="mr-2" />
          Back to List
        </Link>
        
        <div className="flex space-x-2">
          <Link
            href={`/criminals/edit/${id}`}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiEdit2 size={14} className="mr-1" />
            Edit
          </Link>
          
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="px-3 py-1 text-sm bg-danger-100 text-danger-700 rounded-md hover:bg-danger-200 flex items-center"
          >
            <FiTrash2 size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Photo */}
          <div className="md:w-1/3">
            <div className="mb-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <img 
                  src="/placeholder-imgs/criminal-placeholder.jpg" 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className={`border p-3 rounded-lg ${getStatusBadgeColor(status)}`}>
                <div className="font-medium text-center mb-1">Status</div>
                <div className="text-xl font-bold text-center">
                  {status === 'wanted' ? 'WANTED' : 'APPREHENDED'}
                </div>
                {status === 'wanted' && (
                  <div className="mt-2 text-center text-sm">
                    <FiAlertTriangle className="inline mr-1" />
                    Report sightings immediately
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <div className={`p-3 rounded-lg ${getThreatBadgeColor(threat)}`}>
                <div className="font-medium text-center mb-1">Threat Level</div>
                <div className="text-xl font-bold text-center">
                  {threat.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Age</h3>
                <p className="font-medium">{age} years</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Gender</h3>
                <p className="font-medium">{gender?.charAt(0).toUpperCase() + gender?.slice(1)}</p>
              </div>
              
              {height && (
                <div>
                  <h3 className="text-sm text-gray-500">Height</h3>
                  <p className="font-medium">{height} cm</p>
                </div>
              )}
              
              {weight && (
                <div>
                  <h3 className="text-sm text-gray-500">Weight</h3>
                  <p className="font-medium">{weight} kg</p>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Last Known Information</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start mb-3">
                  <FiCalendar className="text-gray-500 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm text-gray-500">Last Seen Date</h3>
                    <p className="font-medium">
                      {/* {lastSeen && format(new Date(lastSeen), 'MMMM d, yyyy h:mm a')}
                       */}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMap className="text-gray-500 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm text-gray-500">Last Known Location</h3>
                    <p className="font-medium">{lastLocation}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Criminal Profile</h2>
              
              <div className="mb-4">
                <h3 className="text-sm text-gray-500 mb-1">Known Crimes</h3>
                <div className="flex flex-wrap gap-2">
                  {crimes?.map((crime, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {crime}
                    </span>
                  ))}
                </div>
              </div>
              
              {notes && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Additional Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line">{notes}</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Sighting History</h2>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-2" size={14} />
                          {/* {lastSeen && format(new Date(lastSeen), 'MMM d, yyyy h:mm a')} */}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{lastLocation}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Camera System</td>
                    </tr>
                    {/* Add more rows for past sightings if available */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the record for <span className="font-medium">{name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriminalDetails;