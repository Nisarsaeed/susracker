import React from "react";

function FacialAlertCard({ data }) {
  const {name,criminal_image,detected_face,confidence,criminal_id,timestamp,camera_location} = data

  const updateCriminalLastSeen = async () => {
      try {
        const formData = new FormData();
  
        formData.set("last_seen_location", camera_location || "Unknown");
        formData.set("last_seen_date", timestamp);
  
        const res = await fetch(`/api/criminals/${criminal_id}`, {
          method: "PUT",
          body: formData,
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to confirm alert");
        }
        
        alert("Criminal confirmed and updated.");
      } catch (err) {
        console.error("Error confirming alert:", err);
        alert("Failed to confirm ");
      }
    };

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-md overflow-hidden my-4">
      <div className="lg:w-1/3 p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-red-700 uppercase">
          Criminal MATCH FOUND
        </h3>
        <p className="text-md font-medium">{name}</p>
        <div>
          <span className="text-sm text-gray-500">Confidence: </span>
          <span
            className={`text-xs font-semibold  px-2 py-1 rounded-full ${
              parseFloat(confidence) > 60
                ? "bg-green-100 text-green-800"
                : parseFloat(confidence) > 50
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {confidence}
          </span>
        </div>
        <p className="text-sm text-gray-500">ID: {criminal_id}</p>
        <p className="text-sm text-gray-500">
          {new Date(timestamp).toLocaleString()}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => updateCriminalLastSeen()}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Detected Face</p>
          <img
            src={`data:image/jpeg;base64,${detected_face}`}
            alt="Detected face"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Criminal Record</p>
          <img
            src={criminal_image}
            alt="Criminal"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      </div>
    </div>
  );
}

export default FacialAlertCard;
