// API Status Component - Monitor Open-Meteo API Health
import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { checkAPIHealth } from '../services/weatherAnalytics';

interface APIStatusProps {
  onStatusChange?: (status: string) => void;
}

const APIStatus: React.FC<APIStatusProps> = ({ onStatusChange }) => {
  const [apiStatus, setApiStatus] = useState<{
    status: string;
    apis: Record<string, boolean>;
    lastChecked?: Date;
  }>({
    status: 'checking',
    apis: {}
  });

  const checkStatus = useCallback(async () => {
    try {
      const health = await checkAPIHealth();
      const statusData = {
        ...health,
        lastChecked: new Date()
      };
      setApiStatus(statusData);
      onStatusChange?.(health.status);
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus({
        status: 'error',
        apis: {},
        lastChecked: new Date()
      });
      onStatusChange?.('error');
    }
  }, [onStatusChange]);

  useEffect(() => {
    checkStatus();
    // Check API health every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case 'healthy':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
    }
  };

  const getStatusText = () => {
    switch (apiStatus.status) {
      case 'healthy':
        return 'All APIs Online';
      case 'degraded':
        return 'Some APIs Offline';
      case 'error':
        return 'Connection Issues';
      default:
        return 'Checking Status...';
    }
  };

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (import.meta.env.VITE_NODE_ENV === 'production' && apiStatus.status === 'healthy') {
    return null; // Hide in production when everything is working
  }

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {apiStatus.lastChecked && (
        <span className="text-xs opacity-75">
          {apiStatus.lastChecked.toLocaleTimeString()}
        </span>
      )}
      
      {/* Detailed status tooltip on hover */}
      {Object.keys(apiStatus.apis).length > 0 && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-white border rounded-lg shadow-lg min-w-48 opacity-0 hover:opacity-100 transition-opacity pointer-events-none hover:pointer-events-auto">
          <div className="text-xs">
            <div className="font-semibold mb-2">API Status Details:</div>
            {Object.entries(apiStatus.apis).map(([api, status]) => (
              <div key={api} className="flex justify-between items-center py-1">
                <span className="capitalize">{api}:</span>
                <span className={status ? 'text-green-600' : 'text-red-600'}>
                  {status ? '✓ Online' : '✗ Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIStatus;