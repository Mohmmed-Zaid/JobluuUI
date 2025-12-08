# JobLuu - Frontend 🚀

> A modern job portal application connecting employers with talented professionals. Built with React, TypeScript, Redux, and styled with Mantine UI and Tailwind CSS.

**Live Demo:** [https://jobluu-ui.vercel.app/](https://jobluu-ui.vercel.app/)  
**GitHub Repository:** [https://github.com/Mohmmed-Zaid/JobluuUI](https://github.com/Mohmmed-Zaid/)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Key Components](#-key-components)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Job Seekers (Applicants)
- 🔍 Advanced job search with filters (location, job type, experience level)
- 📝 Create and manage professional profiles
- 💼 Apply for jobs with one click
- 🔔 Real-time notifications for application updates
- 📊 Track application history
- 🎯 Personalized job recommendations
- 📱 Responsive design for mobile and desktop

### For Employers
- 📋 Post and manage job listings
- 👥 Browse talent profiles
- 🔍 Search for candidates by skills
- 📊 View applicant information
- 🔔 Get notified when candidates apply
- ✏️ Edit and delete job postings
- 📈 Track posted jobs

### General Features
- 🔐 Secure authentication (Email/Password + Google OAuth)
- 🌙 Modern, intuitive UI with smooth animations
- 🔄 Real-time updates and notifications
- 📱 Fully responsive design
- 🎨 Beautiful UI components with Mantine
- ⚡ Fast page loads with Vite
- 🔒 Protected routes for authenticated users
- 🎭 Role-based access (Applicant/Employer)

---

## 🛠 Tech Stack

### Core
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### State Management
- **Redux Toolkit** - State management
- **Redux Persist** - Persist Redux state
- **Redux Persist Transform Encrypt** - Encrypted storage

### UI & Styling
- **Mantine UI v8** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Tabler Icons** - Icon library
- **Framer Motion** - Animation library
- **Lucide React** - Additional icons
- **React Fast Marquee** - Scrolling animations

### Routing & Navigation
- **React Router DOM v6** - Client-side routing

### Rich Text Editing
- **Tiptap** - Rich text editor
- **Tiptap Extensions** - Link, Underline support
- **Tiptap Starter Kit** - Basic editor features

### HTTP & API
- **Axios** - HTTP client
- **Crypto-js** - Encryption utilities

### Additional Libraries
- **React Spinners** - Loading indicators
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
JobluuUI/
├── public/                      # Static assets
├── src/
│   ├── Apply/                   # Job application components
│   │   └── ApplyJob.tsx
│   ├── Components/              # Reusable components
│   │   ├── AuthProvider.tsx
│   │   ├── JobFormModal.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProfileMenu.tsx
│   │   └── ProtectedRoute.tsx
│   ├── FindJobs/                # Job search functionality
│   │   ├── JobCards.tsx
│   │   ├── MultiInput.tsx
│   │   ├── SearchBar.tsx
│   │   └── Sort.tsx
│   ├── FindTalent/              # Talent search for employers
│   │   ├── FindTalent.tsx
│   │   ├── MultiInput.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchDataTalent.ts
│   │   ├── Sort.tsx
│   │   └── Talent.tsx
│   ├── Header/                  # Navigation components
│   │   ├── Header.tsx
│   │   ├── NavLinks.tsx
│   │   └── ProfileMenu.tsx
│   ├── Hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useNotifications.ts
│   ├── JobDesc/                 # Job details page
│   │   └── JobDescription.tsx
│   ├── Landingpage/             # Landing page sections
│   │   ├── Data/
│   │   │   ├── FooterLinks.ts
│   │   │   ├── JobData.ts
│   │   │   ├── SearchData.ts
│   │   │   ├── TalentData.ts
│   │   │   ├── stepsData.ts
│   │   │   └── testimonials.ts
│   │   ├── Companies.tsx
│   │   ├── DreamJob.tsx
│   │   ├── JobCategory.tsx
│   │   ├── Subscribe.tsx
│   │   ├── Testimonials.tsx
│   │   └── Working.tsx
│   ├── Pages/                   # Main application pages
│   │   ├── ApplyJobPage.tsx
│   │   ├── CompanyPage.tsx
│   │   ├── FindJob.tsx
│   │   ├── FindTalent.tsx
│   │   ├── HomePages.tsx
│   │   ├── JobDescPage.tsx
│   │   ├── JobHistoryPage.tsx
│   │   ├── PostedJobPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── TalentProfilePage.tsx
│   │   └── WildCard.tsx
│   ├── Profile/                 # User profile components
│   │   ├── CertificateCard.tsx
│   │   ├── ExpCard.tsx
│   │   ├── Profile.tsx
│   │   └── RecommendTalent.tsx
│   ├── Services/                # API service layer
│   │   ├── AuthService.ts
│   │   ├── FormValidation.tsx
│   │   ├── LocalStorageService.tsx
│   │   ├── ProfileService.tsx
│   │   ├── UserService.tsx
│   │   ├── jobService.ts
│   │   └── notificationService.ts
│   ├── SignUp/                  # Authentication pages
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── ResetPassword.tsx
│   ├── Slice/                   # Redux slices
│   │   ├── ProfileSlice.tsx
│   │   └── UserSlice.ts
│   ├── Store/                   # Redux store configuration
│   │   ├── authSlice.ts
│   │   ├── hooks.ts
│   │   ├── index.ts
│   │   └── userSlice.ts
│   ├── TalentProfile/           # Talent profile views
│   │   ├── CertificateCard.tsx
│   │   ├── ExpCard.tsx
│   │   ├── Profile.tsx
│   │   └── RecommendTalent.tsx
│   ├── UploadJob/               # Job posting components
│   │   ├── SelectInput.tsx
│   │   └── TextEditor.tsx
│   ├── assets/                  # Images and static files
│   ├── config/                  # Configuration files
│   │   └── config.ts
│   ├── context/                 # React context providers
│   │   ├── JobContext.tsx
│   │   └── NotificationContext.tsx
│   ├── footer/                  # Footer component
│   │   └── Footer.tsx
│   ├── notifications/           # Notification system
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationPanel.tsx
│   ├── types/                   # TypeScript type definitions
│   │   └── JobDTO.ts
│   ├── utilities/               # Helper functions
│   │   └── notificationHelpers.ts
│   ├── App.tsx                  # Root component
│   ├── App.css                  # Global styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Base styles
├── .gitignore
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── package-lock.json
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**
- A modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Mohmmed-Zaid/JobluuUI.git
cd JobluuUI
```

### 2. Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

## ⚙️ Configuration

### 1. Create Configuration File

Create a `src/config/config.ts` file:

```typescript
export const config = {
  apiUrl: 'https://jobluubackend.onrender.com',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID_HERE',
};
```

### 2. Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://jobluubackend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Update API URLs

The application uses the following API endpoints:

- **Base URL:** `https://jobluubackend.onrender.com`
- **Auth:** `/api/users/`, `/auth/`
- **Jobs:** `/jobs/`
- **Profiles:** `/api/profiles/`
- **Notifications:** `/notification/`

These are configured in:
- `src/Services/AuthService.ts`
- `src/Services/jobService.ts`
- `src/Services/ProfileService.tsx`
- `src/Services/notificationService.ts`
- `src/Services/UserService.tsx`

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port)

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🧩 Key Components

### Authentication Components
- **`SignUp.tsx`** - User registration with role selection
- **`Login.tsx`** - Email/password and Google OAuth login
- **`ResetPassword.tsx`** - Password recovery flow
- **`AuthProvider.tsx`** - Authentication context provider
- **`ProtectedRoute.tsx`** - Route protection for authenticated users

### Job Components
- **`JobCards.tsx`** - Display job listings in card format
- **`JobDescription.tsx`** - Detailed job information
- **`ApplyJob.tsx`** - Job application form
- **`JobFormModal.tsx`** - Create/edit job posting modal

### Profile Components
- **`Profile.tsx`** - User profile display and editing
- **`ExpCard.tsx`** - Work experience card
- **`CertificateCard.tsx`** - Certification display card

### Search Components
- **`SearchBar.tsx`** - Main search input
- **`MultiInput.tsx`** - Multi-select filters (skills, location)
- **`Sort.tsx`** - Sort options for results

### Notification Components
- **`NotificationBell.tsx`** - Notification icon with badge
- **`NotificationDropdown.tsx`** - Notification list dropdown
- **`NotificationItem.tsx`** - Individual notification item
- **`NotificationPanel.tsx`** - Full notification panel

---

## 🗂 State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  profile: {
    data: ProfileDto | null,
    loading: boolean,
    error: string | null
  },
  user: {
    // Additional user state
  }
}
```

### Key Redux Slices

1. **`authSlice.ts`** - Authentication state
   - User login/logout
   - Token management
   - Loading states

2. **`ProfileSlice.tsx`** - Profile management
   - Profile data
   - Update operations

3. **`UserSlice.ts`** - User information
   - User preferences
   - User settings

### Redux Persist Configuration

The store is persisted to localStorage with encryption:

```typescript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
```

---

## 🔌 API Integration

### Service Layer

All API calls are abstracted into service files:

#### 1. **AuthService.ts**
```typescript
// Login
await authService.login(credentials, dispatch);

// Register
await authService.register(userData, dispatch);

// Google Sign-In
await authService.loginWithGoogle(credential, accountType, dispatch);

// Logout
await authService.logout(dispatch);
```

#### 2. **jobService.ts**
```typescript
// Get all jobs
const jobs = await jobService.getAllJobs();

// Post new job
const job = await jobService.postJob(jobData);

// Update job
await jobService.updateJob(jobId, jobData);

// Delete job
await jobService.deleteJob(jobId);

// Get job by ID
const job = await jobService.getJobById(jobId);
```

#### 3. **ProfileService.tsx**
```typescript
// Get profile
const profile = await getProfile(userId);

// Update profile
await updateProfile(userId, profileData);

// Create profile
await createProfile(profileData);

// Upload avatar
await uploadAvatar(userId, file);
```

#### 4. **notificationService.ts**
```typescript
// Get unread notifications
const notifications = await notificationService.getUnreadNotifications(userId);

// Mark as read
await notificationService.markAsRead(notificationId);

// Send notification
await notificationService.sendNotification(notificationData);
```

### API Response Handling

All services include error handling:

```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Request failed');
  return await response.json();
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

---

## 🔐 Authentication Flow

### 1. Email/Password Authentication

```typescript
// User enters credentials
const credentials = { email, password };

// Service handles login
await authService.login(credentials, dispatch);

// Redux updates state
dispatch(loginSuccess({ token, refreshToken }));

// Token stored in localStorage
localStorage.setItem('token', token);

// User redirected to dashboard
navigate('/dashboard');
```

### 2. Google OAuth Flow

```typescript
// Initialize Google Sign-In
await authService.initializeGoogleAuth();

// User clicks Google button
authService.promptGoogleSignIn(handleCredentialResponse);

// Receive credential
const credential = response.credential;

// Send to backend
await authService.loginWithGoogle(credential, accountType, dispatch);

// User authenticated and redirected
```

### 3. Protected Routes

```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/apply/:jobId" element={<ApplyJobPage />} />
  <Route path="/post-job" element={<PostedJobPage />} />
</Route>
```

### 4. Token Management

```typescript
// Add token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Clear tokens and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy dist folder**
```bash
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set these in your deployment platform:

```env
VITE_API_URL=https://jobluubackend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/AmazingFeature
```

3. **Commit your changes**
```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push to the branch**
```bash
git push origin feature/AmazingFeature
```

5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **Apache-2.0 License**.

---

## 👥 Team

- **Mohmmed Zaid** - Lead Developer

---

## 🐛 Known Issues

- Logo upload for job postings is not yet implemented on backend
- Some profile fields may need additional validation

---

## 🗺 Roadmap

- [ ] Add real-time chat between employers and applicants
- [ ] Implement advanced search filters
- [ ] Add resume upload and parsing
- [ ] Create analytics dashboard
- [ ] Add email notifications
- [ ] Implement job recommendations using AI
- [ ] Add company verification system
- [ ] Create mobile app version

---

## 📞 Support

For support and questions:
- **GitHub Issues:** [Create an issue](https://github.com/Mohmmed-Zaid/JobluuUI/issues)
- **Email:** Contact through GitHub profile

---

## 🙏 Acknowledgments

- Mantine UI for the component library
- Tailwind CSS for utility classes
- React community for excellent documentation
- All contributors and testers

---

Made with ❤️ by MZ
## Used By

This project is used by the following companies:

- Company 1
- Company 2



