"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../../../contexts/SocketContext.js";
import { AiFillExclamationCircle } from "react-icons/ai";
import FacialAlertCard from "../../../components/criminals/FacialAlertCard.jsx";
import VoilenceAlertCard from "../../../components/criminals/VoilenceAlertCard.jsx";

export default function CriminalAlerts() {
  const { alerts, setUnreadCount } = useSocket();

  useEffect(() => {
    setUnreadCount(0);
  }, [alerts]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <div className="space-y-4" key={alert.id}>
            {alert.alert_type === 1 ? (
                <FacialAlertCard data={alert} />
            ) : (
              <VoilenceAlertCard data={alert} />
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center text-red-600 font-normal text-lg">
          <AiFillExclamationCircle size={20} className="me-3" /> No alerts
          recieved
        </div>
      )}
    </div>
  );
}
