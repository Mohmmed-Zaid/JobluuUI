// src/services/notificationService.ts
interface NotificationDTO {
  id?: number;
  userId: number;
  message: string;
  action: string;
  route?: string;
  status?: 'UNREAD' | 'READ';
  timestamp?: string;
  title?: string;
  icon?: string;
}

interface Notification {
  id: number;
  userId: number;
  message: string;
  action: string;
  route?: string;
  status: 'UNREAD' | 'READ';
  timestamp: string;
  title?: string;
  icon?: string;
}

// Fix: Use import.meta.env for Vite or window.location for fallback
const getApiBaseUrl = (): string => {
  // For Vite-based React apps
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8080';
  }
  
  // For Create React App
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }
  
  // Fallback - construct from current origin
  const origin = window.location.origin;
  return origin.includes('localhost') ? 'http://localhost:8080' : origin;
};

const API_BASE_URL = getApiBaseUrl();

class NotificationService {
  // Get unread notifications for a user
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/unread/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch unread notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  // Get all notifications for a user
  async getAllNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/all/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch all notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/count/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return await response.json();
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Send notification
  async sendNotification(notificationData: NotificationDTO): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      if (!response.ok) throw new Error('Failed to send notification');
      return await response.text();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/mark-read/${notificationId}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return await response.text();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: number): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/mark-all-read/${userId}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return await response.text();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/delete/${notificationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return await response.text();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Delete all notifications
  async deleteAllNotifications(userId: number): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/delete-all/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete all notifications');
      return await response.text();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }

  // Get notifications by type
  async getNotificationsByType(userId: number, action: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/type/${userId}/${action}`);
      if (!response.ok) throw new Error('Failed to fetch notifications by type');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  }
}

export default new NotificationService();
export type { Notification, NotificationDTO };