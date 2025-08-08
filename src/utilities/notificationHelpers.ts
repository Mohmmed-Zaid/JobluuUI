// src/utils/notificationHelpers.ts
import { 
  IconBriefcase, 
  IconUser, 
  IconMessage, 
  IconHeart,
  IconEye,
  IconStar,
  IconCheck,
  IconX,
  IconClock,
  IconBell,
  TablerIconsProps
} from '@tabler/icons-react';
// Fix the import path and import syntax
import { type Notification } from '../Services/notificationService';

// Types
interface NotificationConfig {
  icon: React.ComponentType<TablerIconsProps>;
  color: string;
  bgColor: string;
  title: string;
}

interface StatusBadge {
  color: string;
  bgColor: string;
  text: string;
  icon: React.ComponentType<TablerIconsProps>;
}

interface NotificationGroup {
  [key: string]: Notification[];
}

// Notification type configurations
export const NOTIFICATION_TYPES: Record<string, NotificationConfig> = {
  JOB_APPLICATION: {
    icon: IconBriefcase,
    color: '#3b82f6', // blue
    bgColor: '#eff6ff',
    title: 'Job Application',
  },
  PROFILE_UPDATE: {
    icon: IconUser,
    color: '#10b981', // green
    bgColor: '#f0fdf4',
    title: 'Profile Update',
  },
  MESSAGE: {
    icon: IconMessage,
    color: '#8b5cf6', // purple
    bgColor: '#faf5ff',
    title: 'New Message',
  },
  JOB_MATCH: {
    icon: IconHeart,
    color: '#f59e0b', // amber
    bgColor: '#fffbeb',
    title: 'Job Match',
  },
  PROFILE_VIEW: {
    icon: IconEye,
    color: '#06b6d4', // cyan
    bgColor: '#ecfeff',
    title: 'Profile View',
  },
  INTERVIEW_SCHEDULED: {
    icon: IconClock,
    color: '#ef4444', // red
    bgColor: '#fef2f2',
    title: 'Interview Scheduled',
  },
  APPLICATION_STATUS: {
    icon: IconStar,
    color: '#f59e0b', // amber
    bgColor: '#fffbeb',
    title: 'Application Update',
  },
  SYSTEM: {
    icon: IconBell,
    color: '#6b7280', // gray
    bgColor: '#f9fafb',
    title: 'System Notification',
  },
};

// Get notification configuration by action type
export const getNotificationConfig = (action: string): NotificationConfig => {
  return NOTIFICATION_TYPES[action] || NOTIFICATION_TYPES.SYSTEM;
};

// Format timestamp for display
export const formatNotificationTime = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return notificationTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: notificationTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

// Truncate notification message
export const truncateMessage = (message: string, maxLength: number = 100): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};

// Get status badge configuration
export const getStatusBadge = (status: 'UNREAD' | 'READ'): StatusBadge => {
  switch (status) {
    case 'UNREAD':
      return {
        color: '#3b82f6',
        bgColor: '#eff6ff',
        text: 'New',
        icon: IconBell,
      };
    case 'READ':
      return {
        color: '#6b7280',
        bgColor: '#f9fafb',
        text: 'Read',
        icon: IconCheck,
      };
    default:
      return {
        color: '#6b7280',
        bgColor: '#f9fafb',
        text: 'Unknown',
        icon: IconBell,
      };
  }
};

// Group notifications by date
export const groupNotificationsByDate = (notifications: Notification[]): NotificationGroup => {
  const groups: NotificationGroup = {};
  const now = new Date();
  
  notifications.forEach(notification => {
    const notificationDate = new Date(notification.timestamp);
    const diffInDays = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let groupKey;
    if (diffInDays === 0) {
      groupKey = 'Today';
    } else if (diffInDays === 1) {
      groupKey = 'Yesterday';
    } else if (diffInDays < 7) {
      groupKey = 'This Week';
    } else if (diffInDays < 30) {
      groupKey = 'This Month';
    } else {
      groupKey = 'Older';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });
  
  return groups;
};

// Sort notifications by priority and timestamp
export const sortNotifications = (notifications: Notification[]): Notification[] => {
  return notifications.sort((a, b) => {
    // First sort by status (unread first)
    if (a.status !== b.status) {
      return a.status === 'UNREAD' ? -1 : 1;
    }
    
    // Then sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

// Create notification sound/vibration
export const playNotificationSound = (): void => {
  // Create a simple notification sound
  if (typeof Audio !== 'undefined') {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRvIBAABXQVZFZm10IBAAAAABAAEBACABAACAAQAAAQAEAD2BAEdhAABBQUdgAEFBUAABAAAzQkFBRUdgAEFBYABBQUVHYABBQWAAQUFFR2AAQUFgAEFBRUdgAEFBYABBQUVHYABBQWAAQUFFR2AAQUFgAEFBRUdgAEFBYABBQUVHYABBQWAAQUFFR2AAQUFgAEFBRUdgAEFBYABBQUVHYABBQWAAQUFFR2AAQUFgAEFBRUdgAEFBYABBQUVHYABBQWAAQUFFR2AAQUFgAEFBRUdgAEFBYABBQUVH');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors if audio can't be played
      });
    } catch (error) {
      // Ignore audio errors
    }
  }
  
  // Try to vibrate on mobile devices
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
};

// Check if browser supports notifications
export const canShowBrowserNotifications = (): boolean => {
  return 'Notification' in window;
};

// Request browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!canShowBrowserNotifications()) {
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Show browser notification
export const showBrowserNotification = (title: string, message: string, icon: string | null = null): void => {
  if (!canShowBrowserNotifications() || Notification.permission !== 'granted') {
    return;
  }
  
  try {
    const notification = new Notification(title, {
      body: message,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'jobluu-notification',
      renotify: true,
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
    
  } catch (error) {
    console.error('Error showing browser notification:', error);
  }
};