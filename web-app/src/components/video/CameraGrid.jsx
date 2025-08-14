import React, { useState } from 'react';
import CameraCard from './CameraCard';

const CameraGrid = ({ limit, compact = false }) => {
  // Mock camera data
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Main Entrance', location: 'Building A', status: 'active', detectionEnabled: true },
    { id: 2, name: 'Parking Lot', location: 'North Side', status: 'active', detectionEnabled: true },
    { id: 3, name: 'Lobby', location: 'Ground Floor', status: 'active', detectionEnabled: true },
    { id: 4, name: 'Back Entrance', location: 'Building B', status: 'active', detectionEnabled: true },
    { id: 5, name: 'Elevator Area', location: 'Building A', status: 'maintenance', detectionEnabled: false },
    { id: 6, name: 'Storage Room', location: 'Basement', status: 'active', detectionEnabled: true },
  ]);

  // Update camera status
  const toggleCameraStatus = (id) => {
    setCameras(cameras.map(camera => 
      camera.id === id 
        ? { ...camera, status: camera.status === 'active' ? 'disabled' : 'active' } 
        : camera
    ));
  };

  // Toggle detection for a camera
  const toggleDetection = (id) => {
    setCameras(cameras.map(camera => 
      camera.id === id 
        ? { ...camera, detectionEnabled: !camera.detectionEnabled } 
        : camera
    ));
  };

  // Limit number of cameras shown if specified
  const displayCameras = limit ? cameras.slice(0, limit) : cameras;

  return (
    <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
      {displayCameras.map(camera => (
        <CameraCard 
          key={camera.id}
          camera={camera}
          compact={compact}
          onToggleStatus={() => toggleCameraStatus(camera.id)}
          onToggleDetection={() => toggleDetection(camera.id)}
        />
      ))}
    </div>
  );
};

export default CameraGrid;