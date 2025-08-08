// src/components/notifications/NotificationItem.tsx
import React from 'react';
import { IconDots, IconTrash, IconEye } from '@tabler/icons-react';
import { Menu, ActionIcon, Group, Text } from '@mantine/core';
import { 
  getNotificationConfig, 
  formatNotificationTime, 
  truncateMessage 
} from '../utilities/notificationHelpers';
import { useNotificationContext } from '../context/NotificationContext';
import { Notification } from '../Services/notificationService';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  showActions?: boolean;
  compact?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick, 
  showActions = true,
  compact = false 
}) => {
  const { markAsRead, deleteNotification } = useNotificationContext();
  const config = getNotificationConfig(notification.action);
  const Icon = config.icon;

  const handleMarkAsRead = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    if (notification.status === 'UNREAD') {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  const handleClick = (): void => {
    if (notification.status === 'UNREAD') {
      markAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <div
      className={`
        relative p-4 border-l-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer
        ${notification.status === 'UNREAD' 
          ? 'bg-blue-50 border-l-blue-500 shadow-sm' 
          : 'bg-white border-l-gray-200'
        }
        ${compact ? 'p-3' : 'p-4'}
      `}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {notification.status === 'UNREAD' && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div 
          className="flex-shrink-0 p-2 rounded-full"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color 
          }}
        >
          <Icon size={20} stroke={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Title */}
              <Text 
                size="sm" 
                weight={notification.status === 'UNREAD' ? 600 : 500}
                className="text-gray-900 mb-1"
              >
                {notification.title || config.title}
              </Text>

              {/* Message */}
              <Text 
                size="sm" 
                className={`
                  ${notification.status === 'UNREAD' ? 'text-gray-800' : 'text-gray-600'}
                  ${compact ? 'line-clamp-1' : 'line-clamp-2'}
                `}
              >
                {compact 
                  ? truncateMessage(notification.message, 60)
                  : truncateMessage(notification.message, 120)
                }
              </Text>

              {/* Timestamp */}
              <Text size="xs" className="text-gray-500 mt-1">
                {formatNotificationTime(notification.timestamp)}
              </Text>
            </div>

            {/* Actions */}
            {showActions && (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <ActionIcon 
                    variant="subtle" 
                    color="gray"
                    size="sm"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  {notification.status === 'UNREAD' && (
                    <Menu.Item
                      icon={<IconEye size={14} />}
                      onClick={handleMarkAsRead}
                    >
                      Mark as read
                    </Menu.Item>
                  )}
                  
                  <Menu.Item
                    icon={<IconTrash size={14} />}
                    color="red"
                    onClick={handleDelete}
                  >
                    Delete notification
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Action indicator */}
      {notification.route && (
        <div className="mt-2 ml-11">
          <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Click to view details
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;