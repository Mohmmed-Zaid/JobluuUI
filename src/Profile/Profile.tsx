import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IconMapPin,
  IconStar,
  IconBriefcase,
  IconCalendar,
  IconShare,
  IconBookmark,
  IconPencil,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Button,
  Tabs,
  Loader,
  Notification,
} from "@mantine/core";
import ExpCard from "./ExpCard";
import RecommendTalent from "./RecommendTalent";
import CertificateCard from "./CertificateCard";
import Header from "../Header/Header";
import Footer from "../footer/Footer";

// Redux imports
import {
  fetchProfile,
  saveProfile,
  autoSaveProfile,
  uploadAvatar,
  setEditModalOpen,
  clearError,
  updateProfileData,
  updateAbout,
  updateSkills,
  addSkill,
  removeSkill,
  updateAvatar,
  initializeProfile,
  selectProfile,
  selectProfileData,
  selectAbout,
  selectSkills,
  selectAvatar,
  selectStats,
  selectExperiences,
  selectCertifications,
  selectProfileLoading,
  selectProfileSaving,
  selectProfileError,
  selectIsEditModalOpen,
  selectAutoSaveEnabled,
} from "../Slice/ProfileSlice";

// Types
interface User {
  id: number;
  name?: string;
  email?: string;
}

interface RootState {
  auth?: {
    user?: User;
    isAuthenticated?: boolean;
  };
  user?: User;
  profile: any;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Redux selectors
  const profileData = useSelector(selectProfileData);
  const about = useSelector(selectAbout);
  const skills = useSelector(selectSkills);
  const avatar = useSelector(selectAvatar);
  const stats = useSelector(selectStats);
  const experiences = useSelector(selectExperiences);
  const certifications = useSelector(selectCertifications);
  const loading = useSelector(selectProfileLoading);
  const saving = useSelector(selectProfileSaving);
  const error = useSelector(selectProfileError);
  const editOpen = useSelector(selectIsEditModalOpen);
  const autoSaveEnabled = useSelector(selectAutoSaveEnabled);
  
  // Local state for form inputs
  const [newSkill, setNewSkill] = useState("");
  const [profileInitialized, setProfileInitialized] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get user from auth state - Fixed authentication check
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  
  // Try to get user from either auth or user state
  const user = authState?.user || userState;
  const isAuthenticated = authState?.isAuthenticated || !!user;

  const userId = user?.id;

  // Auto-save debounce - Fixed implementation
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const triggerAutoSave = useCallback(() => {
    if (!autoSaveEnabled || !userId || !profileInitialized) return;

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      const profilePayload = {
        id: profileData.id || userId.toString(),
        name: profileData.name || user?.name || "Your Name",
        title: profileData.title,
        company: profileData.company,
        location: profileData.location,
        experience: profileData.experience,
        email: profileData.email || user?.email || "",
        phone: profileData.phone,
        about,
        skills,
        avatar,
        experiences,
        certifications,
        stats,
      };
      
      dispatch(autoSaveProfile({ 
        userId: userId.toString(), 
        delay: 0 
      }));
    }, 1500); // Reduced debounce time to 1.5 seconds

    setAutoSaveTimeout(timeout);
  }, [autoSaveEnabled, userId, profileInitialized, autoSaveTimeout, dispatch, profileData, about, skills, avatar, experiences, certifications, stats, user]);

  // Initialize profile when user is available - Fixed initialization
  useEffect(() => {
    if (user && userId && !profileInitialized) {
      console.log('Initializing profile for user:', userId);
      
      // Initialize profile with user data
      dispatch(initializeProfile({
        userId: userId.toString(),
        name: user.name,
        email: user.email
      }));

      // Fetch existing profile data
      dispatch(fetchProfile(userId.toString()));
      setProfileInitialized(true);
    }
  }, [dispatch, user, userId, profileInitialized]);

  // Auto-save when data changes - Fixed dependency array
  useEffect(() => {
    if (profileInitialized && autoSaveEnabled && userId) {
      triggerAutoSave();
    }
  }, [profileData, about, skills, experiences, certifications, profileInitialized, autoSaveEnabled, userId, triggerAutoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  // Show success message after save
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Show login message if not authenticated - Removed unnecessary loader
  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="w-full max-w-4xl mx-auto mt-8 mb-16 bg-mine-shaft-900 rounded-2xl p-8 text-center">
          <div className="text-white text-lg">Please log in to view your profile</div>
          <div className="text-gray-400 text-sm mt-2">You need to be authenticated to access this page</div>
        </div>
        <Footer />
      </>
    );
  }

  // Enhanced save function with proper error handling
  const handleSaveProfile = async () => {
    if (!userId || !user) return;
    
    const profilePayload = {
      id: profileData.id || userId.toString(),
      name: profileData.name || user.name || "Your Name",
      title: profileData.title || "",
      company: profileData.company || "",
      location: profileData.location || "",
      experience: profileData.experience || "",
      email: profileData.email || user.email || "",
      phone: profileData.phone || "",
      about: about || "",
      skills: skills || [],
      avatar: avatar || "/avatar.png",
      experiences: experiences || [],
      certifications: certifications || [],
      stats: stats || { projects: 0, followers: 0, successRate: 0, rating: 4.9 },
    };
    
    try {
      console.log('Saving profile:', profilePayload);
      
      // Dispatch save action
      const result = await dispatch(saveProfile({ 
        userId: userId.toString(), 
        profileData: profilePayload 
      })).unwrap();
      
      console.log('Profile saved successfully:', result);
      
      // Show success message
      setSaveSuccess(true);
      
      // Close modal
      dispatch(setEditModalOpen(false));
      
    } catch (error) {
      console.error('Save failed:', error);
      // Error will be shown via the error notification
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userId && user) {
      // For immediate UI update
      const objectUrl = URL.createObjectURL(file);
      dispatch(updateAvatar(objectUrl));
      
      // Upload to server
      dispatch(uploadAvatar({ userId: userId.toString(), file }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()));
      setNewSkill("");
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (index: number) => {
    dispatch(removeSkill(index));
  };

  const handleProfileDataChange = (field: keyof typeof profileData, value: string) => {
    dispatch(updateProfileData({ [field]: value }));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateAbout(e.target.value));
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  // Show loading state only for initial load - Simplified loading
  if (loading && !profileInitialized) {
    return (
      <>
        <Header />
        <div className="w-full max-w-4xl mx-auto mt-8 mb-16 bg-mine-shaft-900 rounded-2xl p-8 text-center">
          <Loader size="lg" color="yellow" />
          <div className="text-white mt-4">Loading your profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            color="red"
            title="Error"
            onClose={handleCloseError}
          >
            {error}
          </Notification>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            color="green"
            title="Success"
            onClose={() => setSaveSuccess(false)}
          >
            Profile saved successfully!
          </Notification>
        </div>
      )}

      {/* Auto-save indicator - Enhanced visual feedback */}
      {autoSaveEnabled && saving && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-mine-shaft-800 text-yellow-400 px-4 py-2 rounded-lg text-sm flex items-center border border-yellow-400/20">
            <Loader size="xs" color="yellow" className="mr-2" />
            Saving changes...
          </div>
        </div>
      )}

      {/* All changes saved indicator */}
      {!saving && profileInitialized && !saveSuccess && (
        <div className="fixed top-4 left-4 z-40">
          <div className="bg-green-800/80 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center border border-green-400/20 opacity-80">
            ✓ All changes saved
          </div>
        </div>
      )}

      <Modal
        opened={editOpen}
        onClose={() => dispatch(setEditModalOpen(false))}
        withCloseButton={false}
        centered
        radius="xl"
        size="auto"
        overlayProps={{ blur: 2, backgroundOpacity: 0.6 }}
        styles={{
          content: {
            padding: 0,
            backgroundColor: "transparent",
            borderRadius: "1.5rem",
          },
        }}
      >
        <div className="w-[420px] bg-mine-shaft-900 text-white rounded-l-[30px] rounded-r-[40px] overflow-hidden shadow-2xl border border-bright-sun-400">
          <div className="px-6 py-4 border-b border-slate-700 bg-mine-shaft-800 rounded-tl-3xl">
            <h2 className="text-lg font-bold text-yellow-400">Edit Profile</h2>
            <p className="text-xs text-gray-400 mt-1">
              Changes will be saved when you click Save
            </p>
          </div>

          <Tabs defaultValue="basic" className="px-6 py-5">
            <Tabs.List grow className="mb-4">
              <Tabs.Tab value="basic" className="text-yellow-400">Basic Info</Tabs.Tab>
              <Tabs.Tab value="about" className="text-yellow-400">About</Tabs.Tab>
              <Tabs.Tab value="skills" className="text-yellow-400">Skills</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" className="space-y-4">
              <TextInput
                label="Full Name"
                variant="filled"
                radius="md"
                value={profileData.name || ''}
                onChange={(e) => handleProfileDataChange('name', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Job Title"
                variant="filled"
                radius="md"
                value={profileData.title || ''}
                onChange={(e) => handleProfileDataChange('title', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Company"
                variant="filled"
                radius="md"
                value={profileData.company || ''}
                onChange={(e) => handleProfileDataChange('company', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Location"
                variant="filled"
                radius="md"
                value={profileData.location || ''}
                onChange={(e) => handleProfileDataChange('location', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Experience"
                variant="filled"
                radius="md"
                value={profileData.experience || ''}
                onChange={(e) => handleProfileDataChange('experience', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Email"
                variant="filled"
                radius="md"
                value={profileData.email || ''}
                onChange={(e) => handleProfileDataChange('email', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <TextInput
                label="Phone"
                variant="filled"
                radius="md"
                value={profileData.phone || ''}
                onChange={(e) => handleProfileDataChange('phone', e.target.value)}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
            </Tabs.Panel>

            <Tabs.Panel value="about" className="space-y-4">
              <Textarea
                label="About"
                variant="filled"
                radius="md"
                minRows={4}
                autosize
                value={about}
                onChange={handleAboutChange}
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
            </Tabs.Panel>

            <Tabs.Panel value="skills" className="space-y-4">
              <TextInput
                label="Add Skill"
                variant="filled"
                radius="md"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                rightSection={
                  <Button
                    size="xs"
                    variant="subtle"
                    color="yellow"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </Button>
                }
                classNames={{
                  input: "bg-mine-shaft-800 text-white border border-slate-700",
                  label: "text-yellow-400 font-semibold",
                }}
              />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center bg-mine-shaft-800 text-gray-200 px-3 py-1 rounded-full text-sm border border-slate-700 hover:border-yellow-400 transition-all"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(i)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </Tabs.Panel>
          </Tabs>

          <div className="px-6 pb-5">
            <Button
              onClick={handleSaveProfile}
              fullWidth
              radius="md"
              loading={saving}
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="w-full max-w-4xl mx-auto mt-8 mb-16 bg-mine-shaft-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
        {/* Banner */}
        <div className="relative">
          <img className="w-full h-48 object-cover" src="/banner.png" alt="Banner" />
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-mine-shaft-800 p-2 rounded-full hover:bg-mine-shaft-700 transition">
              <IconShare size={18} className="text-yellow-400" />
            </button>
            <button className="bg-mine-shaft-800 p-2 rounded-full hover:bg-mine-shaft-700 transition">
              <IconBookmark size={18} className="text-yellow-400" />
            </button>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-20 left-8">
            <div className="relative group">
              <img
                className="w-40 h-40 rounded-full border-6 border-mine-shaft-900 shadow-2xl object-cover ring-4 ring-yellow-400/20"
                src={avatar || "/avatar.png"}
                alt="Avatar"
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <ActionIcon
                variant="filled"
                className="absolute bottom-2 right-2 bg-yellow-400 hover:bg-yellow-500 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconPencil size={16} />
              </ActionIcon>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <IconStar size={12} className="mr-1" />
                  {stats.rating || 4.9}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Main */}
        <div className="pt-24 pb-8 px-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {profileData.name || user.name || "Your Name"}
              </h2>
              <p className="text-lg text-yellow-400 font-semibold mt-1">
                {profileData.title || "Your Title"}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center">
                  <IconBriefcase size={16} className="mr-1.5 text-yellow-400" />
                  {profileData.company || profileData.experience || "Company"}
                </div>
                <div className="flex items-center">
                  <IconCalendar size={16} className="mr-1.5 text-yellow-400" />
                  Available Now
                </div>
              </div>
            </div>
            <ActionIcon
              variant="subtle"
              color="yellow"
              radius="xl"
              size="lg"
              className="bg-mine-shaft-800 hover:bg-mine-shaft-700 p-2 transition hover:scale-110"
              onClick={() => dispatch(setEditModalOpen(true))}
            >
              <IconPencil size={20} />
            </ActionIcon>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-300 mb-6 bg-mine-shaft-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
            <IconMapPin className="h-5 w-5 mr-2 text-yellow-400" />
            <span className="font-medium">{profileData.location || "Location"}</span>
            <span className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              Open to Remote
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Projects", value: stats.projects || 0 },
              { label: "Followers", value: stats.followers || 0 },
              { label: "Success Rate", value: `${stats.successRate || 0}%` },
            ].map(({ label, value }, i) => (
              <div
                key={i}
                className="bg-mine-shaft-800/50 p-4 rounded-xl text-center border border-slate-700/50 hover:border-yellow-400/30 transition"
              >
                <div className="text-2xl font-bold text-yellow-400">{value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg">About</h3>
            <div className="text-gray-300 text-sm leading-relaxed bg-mine-shaft-800/30 p-4 rounded-xl border border-slate-700/30">
              {about || "Tell us about yourself..."}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3 text-lg">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-mine-shaft-800 hover:bg-mine-shaft-700 text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm border border-slate-700/50 hover:border-yellow-400/50 transition cursor-pointer"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet. Click edit to add your skills.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-sm px-6 py-3 rounded-xl transition hover:scale-105 active:scale-95">
              Connect Now
            </button>
            <button className="flex-1 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-sm px-6 py-3 rounded-xl transition hover:scale-105 active:scale-95">
              Send Message
            </button>
            <button className="bg-mine-shaft-800 hover:bg-mine-shaft-700 text-gray-300 hover:text-white px-4 py-3 rounded-xl border border-slate-700/50 hover:border-yellow-400/50 transition">
              <IconBookmark size={18} />
            </button>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Experience</h3>
            <ExpCard experiences={experiences} />
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Certifications</h3>
            <CertificateCard certifications={certifications} />
          </div>

          {/* Recommended Talent */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Recommended Talent</h3>
            <RecommendTalent />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
