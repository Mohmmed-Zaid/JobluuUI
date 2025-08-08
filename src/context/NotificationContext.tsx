// src/context/NotificationContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import notificationService, { Notification } from '../Services/notificationService';

// Types
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface NotificationContextType extends NotificationState {
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  refreshNotifications: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
  userId: number | string | null; // Fixed: Allow null userId
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  DELETE_ALL_NOTIFICATIONS: 'DELETE_ALL_NOTIFICATIONS',
  SET_ERROR: 'SET_ERROR',
} as const;

type NotificationAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: number }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: number }
  | { type: 'DELETE_ALL_NOTIFICATIONS' }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return { 
        ...state, 
        notifications: action.payload, 
        loading: false,
        error: null 
      };
    
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, status: 'READ' as const } : n // Fixed: Consistent status values
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, status: 'read' as const })), // Fixed: Consistent status values
        unreadCount: 0,
      };
    
    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: deletedNotification?.status === 'UNREAD' 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    
    case NOTIFICATION_ACTIONS.DELETE_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Fetch notifications on mount and user change
  useEffect(() => {
    // Fixed: Only fetch if userId is valid
    if (userId && !isNaN(Number(userId))) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId]);

  // Actions
  const fetchNotifications = async (): Promise<void> => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
    try {
      const notifications = await notificationService.getAllNotifications(Number(userId));
      dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async (): Promise<void> => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    try {
      const count = await notificationService.getUnreadCount(Number(userId));
      dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: number): Promise<void> => {
    try {
      await notificationService.markAsRead(notificationId);
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    try {
      await notificationService.markAllAsRead(Number(userId));
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  const deleteNotification = async (notificationId: number): Promise<void> => {
    try {
      await notificationService.deleteNotification(notificationId);
      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, payload: notificationId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  const deleteAllNotifications = async (): Promise<void> => {
    if (!userId || isNaN(Number(userId))) return; // Fixed: Check for valid userId
    
    try {
      await notificationService.deleteAllNotifications(Number(userId));
      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_ALL_NOTIFICATIONS });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  const addNotification = (notification: Notification): void => {
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const refreshNotifications = (): void => {
    if (userId && !isNaN(Number(userId))) { // Fixed: Check for valid userId
      fetchNotifications();
      fetchUnreadCount();
    }
  };

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;