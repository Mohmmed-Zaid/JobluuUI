// src/components/notifications/NotificationDropdown.tsx
import React, { useState, ReactNode } from 'react';
import { 
  Popover, 
  Text, 
  Button, 
  ScrollArea,
  Group,
  ActionIcon,
  Divider,
  Badge,
  Tabs,
  Center,
  Loader
} from '@mantine/core';
import { 
  IconBell, 
  IconSettings, 
  IconCheck, 
  IconTrash,
  IconRefresh 
} from '@tabler/icons-react';
import { useNotificationContext } from '../context/NotificationContext';
import { groupNotificationsByDate, sortNotifications } from '../utilities/notificationHelpers';
import NotificationItem from './NotificationItem';
import { useNavigate } from 'react-router-dom'; // Fixed: Use useNavigate instead of useRouter
import { Notification } from '../Services/notificationService';

interface NotificationDropdownProps {
  children: ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children }) => {
  const navigate = useNavigate(); // Fixed: Use useNavigate instead of useRouter
  const [opened, setOpened] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    deleteAllNotifications,
    refreshNotifications
  } = useNotificationContext();

  // Filter notifications based on active tab
  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;
    
    if (activeTab === 'unread') {
      filtered = notifications.filter(n => n.status === 'UNREAD');
    }
    
    return sortNotifications(filtered);
  }, [notifications, activeTab]);

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  const handleNotificationClick = (notification: Notification): void => {
    if (notification.route) {
      navigate(notification.route); // Fixed: Use navigate instead of router.push
    }
    setOpened(false);
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    await markAllAsRead();
  };

  const handleDeleteAll = async (): Promise<void> => {
    await deleteAllNotifications();
  };

  const handleRefresh = (): void => {
    refreshNotifications();
  };

  return (
    <Popover
      width={400}
      position="bottom-end"
      withArrow
      shadow="lg"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <div onClick={() => setOpened(!opened)}>
          {children}
        </div>
      </Popover.Target>

      <Popover.Dropdown p={0} className="overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b">
          <Group position="apart" align="center">
            <Group spacing="xs">
              <IconBell size={20} className="text-gray-700" />
              <Text weight={600} size="lg" className="text-gray-900">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Badge size="sm" color="blue" variant="filled">
                  {unreadCount}
                </Badge>
              )}
            </Group>
            
            <Group spacing="xs">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleRefresh}
                loading={loading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
              
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
              >
                <IconSettings size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List className="px-4 bg-gray-50">
            <Tabs.Tab value="all">All</Tabs.Tab>
            <Tabs.Tab value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge size="xs" color="blue" variant="filled" ml="xs">
                  {unreadCount}
                </Badge>
              )}
            </Tabs.Tab>
          </Tabs.List>

          {/* Action buttons */}
          {filteredNotifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b">
              <Group spacing="xs">
                {unreadCount > 0 && (
                  <Button
                    variant="subtle"
                    size="xs"
                    leftIcon={<IconCheck size={14} />}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
                
                <Button
                  variant="subtle"
                  size="xs"
                  color="red"
                  leftIcon={<IconTrash size={14} />}
                  onClick={handleDeleteAll}
                >
                  Clear all
                </Button>
              </Group>
            </div>
          )}

          {/* Content */}
          <Tabs.Panel value={activeTab} pt={0}>
            {loading ? (
              <Center className="py-8">
                <Loader size="sm" />
              </Center>
            ) : filteredNotifications.length === 0 ? (
              <Center className="py-8">
                <div className="text-center">
                  <IconBell size={48} className="text-gray-300 mx-auto mb-2" />
                  <Text size="sm" color="dimmed">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </Text>
                </div>
              </Center>
            ) : (
              <ScrollArea.Autosize maxHeight={400}>
                <div className="divide-y divide-gray-100">
                  {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                    <div key={group}>
                      {/* Date group header */}
                      <div className="px-4 py-2 bg-gray-50 border-b">
                        <Text size="xs" weight={600} color="dimmed" className="uppercase">
                          {group}
                        </Text>
                      </div>
                      
                      {/* Notifications in this group */}
                      {groupNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={handleNotificationClick}
                          compact
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea.Autosize>
            )}
          </Tabs.Panel>
        </Tabs>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <>
            <Divider />
            <div className="p-3 bg-gray-50">
              <Button
                variant="subtle"
                fullWidth
                size="sm"
                onClick={() => {
                  navigate('/notifications'); // Fixed: Use navigate instead of router.push
                  setOpened(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default NotificationDropdown;