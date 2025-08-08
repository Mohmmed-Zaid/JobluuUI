// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import notificationService, { Notification, NotificationDTO } from '../Services/notificationService';
import { 
  playNotificationSound, 
  showBrowserNotification,
  requestNotificationPermission 
} from '../utilities/notificationHelpers';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  getNotificationsByType: (action: string) => Promise<Notification[]>;
  sendNotification: (notificationData: NotificationDTO) => Promise<void>;
  refreshNotifications: () => void;
}

const useNotifications = (userId: number | string | null): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  // Request notification permission
  useEffect(() => {
    const initPermission = async (): Promise<void> => {
      if (userId && !isNaN(Number(userId))) { // Fixed: Check for valid userId
        const granted = await requestNotificationPermission();
        setHasPermission(granted);
      }
    };
    
    initPermission();
  }, [userId]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (): Promise<void> => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    setLoading(true);
    setError(null);
    
    try {
      const [allNotifications, count] = await Promise.all([
        notificationService.getAllNotifications(Number(userId)),
        notificationService.getUnreadCount(Number(userId))
      ]);
      
      setNotifications(allNotifications);
      setUnreadCount(count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch notifications on userId change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, status: 'READ' as const } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    try {
      await notificationService.markAllAsRead(Number(userId));
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'READ' as const }))
      );
      
      setUnreadCount(0);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error marking all notifications as read:', err);
    }
  }, [userId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      const deletedNotification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      
      if (deletedNotification?.status === 'UNREAD') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    try {
      await notificationService.deleteAllNotifications(Number(userId));
      
      setNotifications([]);
      setUnreadCount(0);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting all notifications:', err);
    }
  }, [userId]);

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    if (notification.status === 'UNREAD') {
      setUnreadCount(prev => prev + 1);
      
      // Play sound and show browser notification
      playNotificationSound();
      
      if (hasPermission) {
        showBrowserNotification(
          notification.title || 'New Notification',
          notification.message
        );
      }
    }
  }, [hasPermission]);

  // Get notifications by type
  const getNotificationsByType = useCallback(async (action: string): Promise<Notification[]> => {
    if (!userId || isNaN(Number(userId))) return []; // Fixed: Check for valid userId
    
    try {
      const notifications = await notificationService.getNotificationsByType(Number(userId), action);
      return notifications;
    } catch (err) {
      console.error('Error fetching notifications by type:', err);
      return [];
    }
  }, [userId]);

  // Send notification (admin function)
  const sendNotification = useCallback(async (notificationData: NotificationDTO) => {
    try {
      await notificationService.sendNotification(notificationData);
      
      // If sending to current user, add to local state
      if (notificationData.userId === Number(userId)) {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now(), // Temporary ID
          timestamp: new Date().toISOString(),
          status: 'UNREAD'
        };
        
        addNotification(newNotification);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error sending notification:', err);
      throw err;
    }
  }, [userId, addNotification]);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    getNotificationsByType,
    sendNotification,
    refreshNotifications,
  };
};

export default useNotifications;