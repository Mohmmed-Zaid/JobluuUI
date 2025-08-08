import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  Avatar,
  Switch,
  rem,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconUserCircle,
  IconMessageCircle,
  IconFileText,
  IconMoon,
  IconSun,
  IconArrowsLeftRight,
  IconTrash,
  IconLogout2,
  IconCamera,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import {
  selectProfileData,
  selectAvatar,
  updateAvatar,
  uploadAvatar,
  updateProfileData,
} from "../Slice/ProfileSlice";

const ProfileMenu = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // Get profile data from Redux
  const profileData = useSelector(selectProfileData);
  const avatar = useSelector(selectAvatar);
  
  // Get user from auth state (same logic as Profile component)
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  const user = authState?.user || userState;
  const userId = user?.id;

  // Get current name and avatar with fallbacks
  const currentName = profileData?.name || user?.name || "User";
  const currentAvatar = avatar || "/avatar.png";

  // Toggle site-wide dark mode logic
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  // Log out functionality
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      console.log("Deleting account...");
    }
  };

  // Handle avatar change from header
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file && userId) {
      // For immediate UI update
      const objectUrl = URL.createObjectURL(file);
      dispatch(updateAvatar(objectUrl));
      
      // Upload to server
      dispatch(uploadAvatar({ userId: userId.toString(), file }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarChange}
      />
      
      <Menu shadow="md" width={220} position="bottom-end">
        <Menu.Target>
          <div 
            className={`flex cursor-pointer items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              isHovered ? 'border border-yellow-400 bg-mine-shaft-800/50' : 'border border-transparent'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-white font-medium">{currentName}</div>
            <div className="relative group">
              <Avatar src={currentAvatar} alt="You" size="md" />
              {/* Camera overlay on hover */}
              <div 
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAvatarClick();
                }}
              >
                <IconCamera size={16} className="text-white" />
              </div>
            </div>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          {/* Profile section with avatar change option */}
          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="relative">
              <Avatar src={currentAvatar} alt="You" size="lg" />
              <ActionIcon
                size="sm"
                className="absolute -bottom-1 -right-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={handleAvatarClick}
              >
                <IconCamera size={12} />
              </ActionIcon>
            </div>
            <div>
              <div className="font-semibold text-sm">{currentName}</div>
              <div className="text-xs text-gray-500">
                {profileData?.email || user?.email || "user@example.com"}
              </div>
            </div>
          </div>

          <Divider my="xs" />

          {/* Profile link */}
          <Menu.Item
            leftSection={<IconUserCircle size={16} />}
            component={Link}
            to="/profile"
          >
            Profile
          </Menu.Item>

          {/* Messages */}
          <Menu.Item
            leftSection={<IconMessageCircle size={16} />}
            component={Link}
            to="/messages"
          >
            Messages
          </Menu.Item>

          {/* Resume */}
          <Menu.Item
            leftSection={<IconFileText size={16} />}
            component={Link}
            to="/resume"
          >
            Resume
          </Menu.Item>

          <Divider my="xs" />

          {/* Dark Mode Toggle */}
          <Menu.Item
            leftSection={<IconMoon size={16} />}
            rightSection={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                size="md"
                color="yellow"
                onLabel={
                  <IconSun
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={2.5}
                  />
                }
                offLabel={
                  <IconMoon
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={2.5}
                  />
                }
              />
            }
          >
            Dark Mode
          </Menu.Item>

          <Divider my="xs" />
          <Menu.Label>Account</Menu.Label>

          {/* Transfer Data */}
          <Menu.Item leftSection={<IconArrowsLeftRight size={16} />}>
            Transfer my data
          </Menu.Item>

          {/* Delete Account */}
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={handleDeleteAccount}
          >
            Delete my account
          </Menu.Item>

          {/* Logout */}
          <Menu.Item
            leftSection={<IconLogout2 size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default ProfileMenu;