import { 
    AiOutlineVideoCamera, 
    AiOutlineUser, 
    AiOutlineAlert, 
    AiOutlineBarChart 
  } from 'react-icons/ai';
  
  export default function Stats({ stats }) {
    const statItems = [
      {
        name: 'Total Cameras',
        value: stats.totalCameras || 0,
        icon: <AiOutlineVideoCamera className="h-6 w-6 text-primary-600" />,
        change: '+2 from last week',
        changeType: 'increase'
      },
      {
        name: 'Criminal Database',
        value: stats.totalCriminals || 0,
        icon: <AiOutlineUser className="h-6 w-6 text-secondary-600" />,
        change: '+5 from last month',
        changeType: 'increase'
      },
      {
        name: 'Active Detections',
        value: stats.activeDetections || 0,
        icon: <AiOutlineAlert className="h-6 w-6 text-danger-600" />,
        change: 'Today',
        changeType: 'neutral'
      },
      {
        name: 'Detection Rate',
        value: `${stats.detectionRate || 0}%`,
        icon: <AiOutlineBarChart className="h-6 w-6 text-green-600" />,
        change: '+2.5% from last week',
        changeType: 'increase'
      }
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xs ${
                stat.changeType === 'increase' 
                  ? 'text-green-600 dark:text-green-400' 
                  : stat.changeType === 'decrease' 
                  ? 'text-danger-600 dark:text-danger-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }