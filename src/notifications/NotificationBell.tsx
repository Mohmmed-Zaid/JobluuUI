// src/components/notifications/NotificationBell.tsx
import React, { useEffect } from 'react';
import { IconBell } from '@tabler/icons-react';
import { Indicator } from '@mantine/core';
import { useNotificationContext } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  playNotificationSound,
  showBrowserNotification,
  requestNotificationPermission
} from '../utilities/notificationHelpers';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const { unreadCount, notifications } = useNotificationContext();
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [previousCount, setPreviousCount] = React.useState<number>(0);

  // Request notification permission on mount
  useEffect(() => {
    const initPermission = async (): Promise<void> => {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
    };
    
    initPermission();
  }, []);

  // Handle new notifications
  useEffect(() => {
    if (unreadCount > previousCount && previousCount > 0) {
      // Play sound for new notifications
      playNotificationSound();
      
      // Show browser notification for the latest notification
      if (hasPermission && notifications.length > 0) {
        const latestNotification = notifications.find(n => n.status === 'UNREAD');
        if (latestNotification) {
          showBrowserNotification(
            'New Notification',
            latestNotification.message
          );
        }
      }
    }
    
    setPreviousCount(unreadCount);
  }, [unreadCount, notifications, hasPermission, previousCount]);

  return (
    <NotificationDropdown>
      <div className={`bg-mine-shaft-900 p-1.5 rounded-full cursor-pointer hover:bg-mine-shaft-800 transition-colors ${className}`}>
        <Indicator
          offset={6}
          size={9}
          processing={unreadCount > 0}
          withBorder
          disabled={unreadCount === 0}
          styles={{ 
            indicator: {
              backgroundColor: "#ffbd20",
              border: "2px solid #1f2937"
            }
          }}
          label={unreadCount > 99 ? '99+' : unreadCount > 0 ? unreadCount : undefined}
        >
          <IconBell 
            stroke={1.5}
            className={`transition-all duration-200 ${
              unreadCount > 0 
                ? 'text-yellow-400 animate-pulse' 
                : 'text-white hover:text-yellow-400'
            }`}
          />
        </Indicator>
      </div>
    </NotificationDropdown>
  );
};

export default NotificationBell;