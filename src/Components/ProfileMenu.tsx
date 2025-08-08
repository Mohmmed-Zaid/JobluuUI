// Components/ProfileMenu.tsx
import React from 'react';
import { Menu, Avatar, Button } from '@mantine/core';
import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import { removeUser } from '../Store/userSlice';
import { useNavigate } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { profile } = useAppSelector((state) => state.user);
  const authState = useAppSelector((state) => state.auth || {});
  
  // Extract auth properties with fallbacks
  const isAuthenticated = authState.isAuthenticated || !!localStorage.getItem('authToken');
  const user = authState.user;

  // Debug logging
  console.log('ProfileMenu - isAuthenticated:', isAuthenticated);
  console.log('ProfileMenu - profile:', profile);
  console.log('ProfileMenu - user from auth:', user);
  console.log('ProfileMenu - token from localStorage:', localStorage.getItem('authToken'));

  const handleLogout = () => {
    console.log('ProfileMenu - Logout clicked');
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    
    // Clear user data from Redux
    dispatch(removeUser());
    
    // If authSlice has logout action, we would dispatch it here
    // For now, we'll just clear the data manually
    
    // Navigate to home
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Only show Sign In if NOT authenticated
  if (!isAuthenticated) {
    console.log('ProfileMenu - Not authenticated, showing Sign In button');
    return (
      <Button
        variant="outline"
        color="yellow"
        size="sm"
        onClick={() => navigate('/signup')}
      >
        Sign In
      </Button>
    );
  }

  // If authenticated but no profile, show basic user info from auth state
  const displayUser = profile || user;
  const displayName = displayUser?.name || displayUser?.email || 'User';
  const displayEmail = displayUser?.email || '';

  console.log('ProfileMenu - Authenticated, showing profile menu for:', displayName);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar
          src={displayUser?.avatar}
          alt={displayName}
          size="sm"
          color="yellow"
          className="cursor-pointer"
        >
          {displayName?.charAt(0).toUpperCase()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          {displayName}
          <br />
          <span className="text-xs text-gray-500">{displayEmail}</span>
        </Menu.Label>
        <Menu.Divider />

        <Menu.Item
          leftSection={<IconUser size={14} />}
          onClick={handleProfileClick}
        >
          My Profile
        </Menu.Item>

        <Menu.Item leftSection={<IconSettings size={14} />}>
          Settings
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconLogout size={14} />}
          color="red"
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;