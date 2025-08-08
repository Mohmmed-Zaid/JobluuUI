// src/components/notifications/NotificationPanel.tsx
import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Tabs,
  Badge,
  ActionIcon,
  Select,
  TextInput,
  Center,
  Loader,
  Paper
} from '@mantine/core';
import {
  IconBell,
  IconSearch,
  IconFilter,
  IconCheck,
  IconTrash,
  IconRefresh,
  IconSettings
} from '@tabler/icons-react';
import { useNotificationContext } from '../context/NotificationContext';
import { groupNotificationsByDate, sortNotifications } from '../utilities/notificationHelpers';
import NotificationItem from './NotificationItem';
import { useNavigate } from 'react-router-dom'; // Fixed: Use useNavigate instead of useRouter
import { Notification } from '../Services/notificationService';

interface SelectOption {
  value: string;
  label: string;
}

const NotificationPanel: React.FC = () => {
  const navigate = useNavigate(); // Fixed: Use useNavigate instead of useRouter
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    deleteAllNotifications,
    refreshNotifications
  } = useNotificationContext();

  // Filter notifications based on tab, search, and type
  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;
    
    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => n.status === 'UNREAD');
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.message.toLowerCase().includes(query) ||
        (n.title && n.title.toLowerCase().includes(query))
      );
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.action === filterType);
    }
    
    return sortNotifications(filtered);
  }, [notifications, activeTab, searchQuery, filterType]);

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  // Get unique notification types for filter
  const notificationTypes: SelectOption[] = React.useMemo(() => {
    const types = [...new Set(notifications.map(n => n.action))];
    return types.map(type => ({
      value: type,
      label: type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [notifications]);

  const handleNotificationClick = (notification: Notification): void => {
    if (notification.route) {
      navigate(notification.route); // Fixed: Use navigate instead of router.push
    }
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
    <Container size="lg" className="py-8">
      {/* Header */}
      <Paper shadow="sm" p="md" mb="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Group position="apart" align="center">
          <div>
            <Group spacing="xs" mb="xs">
              <IconBell size={28} className="text-blue-600" />
              <Title order={2} className="text-gray-900">
                Notifications
              </Title>
              {unreadCount > 0 && (
                <Badge size="lg" color="blue" variant="filled">
                  {unreadCount} unread
                </Badge>
              )}
            </Group>
            <Text color="dimmed" size="sm">
              Stay updated with your job applications and profile activity
            </Text>
          </div>
          
          <Group spacing="xs">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={handleRefresh}
              loading={loading}
            >
              <IconRefresh size={18} />
            </ActionIcon>
            
            <ActionIcon
              variant="light"
              color="gray"
              size="lg"
            >
              <IconSettings size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      {/* Filters and Search */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group position="apart" align="end" mb="md">
          <Group>
            <TextInput
              placeholder="Search notifications..."
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
            
            <Select
              placeholder="Filter by type"
              icon={<IconFilter size={16} />}
              value={filterType}
              onChange={(value) => setFilterType(value || 'all')}
              data={[
                { value: 'all', label: 'All Types' },
                ...notificationTypes
              ]}
              style={{ width: 200 }}
            />
          </Group>
          
          <Group spacing="xs">
            {unreadCount > 0 && (
              <Button
                variant="light"
                color="blue"
                leftIcon={<IconCheck size={16} />}
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button
                variant="light"
                color="red"
                leftIcon={<IconTrash size={16} />}
                onClick={handleDeleteAll}
              >
                Clear all
              </Button>
            )}
          </Group>
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onTabChange={(value) => setActiveTab(value || 'all')}>
          <Tabs.List>
            <Tabs.Tab value="all">
              All Notifications
              <Badge size="sm" color="gray" variant="light" ml="xs">
                {notifications.length}
              </Badge>
            </Tabs.Tab>
            <Tabs.Tab value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge size="sm" color="blue" variant="filled" ml="xs">
                  {unreadCount}
                </Badge>
              )}
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Paper>

      {/* Notifications Content */}
      {loading ? (
        <Center className="py-16">
          <div className="text-center">
            <Loader size="lg" mb="md" />
            <Text color="dimmed">Loading notifications...</Text>
          </div>
        </Center>
      ) : filteredNotifications.length === 0 ? (
        <Center className="py-16">
          <div className="text-center">
            <IconBell size={64} className="text-gray-300 mx-auto mb-4" />
            <Title order={3} color="dimmed" mb="xs">
              {searchQuery || filterType !== 'all' 
                ? 'No matching notifications' 
                : activeTab === 'unread' 
                  ? 'No unread notifications' 
                  : 'No notifications yet'
              }
            </Title>
            <Text color="dimmed" size="sm">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'New notifications will appear here when they arrive'
              }
            </Text>
          </div>
        </Center>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
            <Paper key={group} shadow="sm" className="overflow-hidden">
              {/* Date group header */}
              <div className="px-6 py-3 bg-gray-50 border-b">
                <Text weight={600} color="dimmed" className="uppercase text-xs tracking-wide">
                  {group}
                </Text>
              </div>
              
              {/* Notifications in this group */}
              <div className="divide-y divide-gray-100">
                {groupNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                    showActions={true}
                    compact={false}
                  />
                ))}
              </div>
            </Paper>
          ))}
        </div>
      )}
    </Container>
  );
};

export default NotificationPanel;