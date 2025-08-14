'use client';
import DashboardStats from '../../components/dashboard/DashboardStats';
// import RecentAlerts from '../components/dashboard/RecentAlerts';
// import ActivityLog from '../components/dashboard/ActivityLog';
import CameraGrid from '../../components/video/CameraGrid';

const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold ">Dashboard</h1>
        <p className="text-gray-600 ">Monitor and manage criminal detection system</p>
      </div>
      <DashboardStats />      
    </div>
  );
};

export default Dashboard;