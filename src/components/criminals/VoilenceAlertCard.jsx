import React from "react";

function VoilenceAlertCard({ data }) {
  const {event_type, camera_id,timestamp} = data
  return (
    <div className="alert-card">
      <h3 className="text-lg font-bold text-red-700">
        Criminal Activity Detected
      </h3>
      <p className="text-md font-medium">{event_type}</p>
      <p className="text-sm text-gray-500">Camera ID: {camera_id}</p>
      <p className="text-sm text-gray-500">
        {new Date(timestamp).toLocaleString()}
      </p>
    </div>
  );
}

export default VoilenceAlertCard;
