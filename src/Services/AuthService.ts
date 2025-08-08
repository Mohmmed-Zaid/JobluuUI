// Services/AuthService.ts
import { AppDispatch } from '../Store';
import { loginUser, loginStart, loginSuccess, loginFailure, logout, setUser } from '../Store/authSlice';
import { config } from '../config/config'; // Adjust path as needed

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
  accountType: 'APPLICANT' | 'EMPLOYER';
}

declare global {
  interface Window {
    google: any;
    googleInitPromise: Promise<void> | null;
  }
}

class AuthService {
  private baseURL = config.apiUrl;
  private googleInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Initialize Google Sign-In
  async initializeGoogleAuth(): Promise<void> {
    // Return existing promise if initialization is already in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return resolved promise if already initialized
    if (this.googleInitialized && window.google) {
      return Promise.resolve();
    }

    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Check if Google script is already loaded
        if (window.google?.accounts?.id) {
          this.googleInitialized = true;
          resolve();
          return;
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          try {
            // Initialize Google Sign-In
            window.google.accounts.id.initialize({
              client_id: config.googleClientId, // Make sure this is in your config
              callback: () => {}, // We'll handle callbacks separately
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            
            this.googleInitialized = true;
            console.log('✅ Google Sign-In initialized successfully');
            resolve();
          } catch (error) {
            console.error('❌ Failed to initialize Google Sign-In:', error);
            reject(error);
          }
        };

        script.onerror = (error) => {
          console.error('❌ Failed to load Google Sign-In script:', error);
          reject(new Error('Failed to load Google Sign-In script'));
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ Error setting up Google Sign-In:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  // Check if Google is initialized
  isGoogleInitialized(): boolean {
    return this.googleInitialized && !!window.google?.accounts?.id;
  }

  // Prompt Google Sign-In
  promptGoogleSignIn(callback: (response: any) => void): void {
    if (!this.isGoogleInitialized()) {
      throw new Error('Google Sign-In not initialized');
    }

    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if prompt is not displayed
          this.renderGoogleButton(callback);
        }
      });

      // Set up one-tap callback
      window.google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      console.error('❌ Error prompting Google Sign-In:', error);
      callback({ error: 'failed_to_prompt' });
    }
  }

  // Render Google button as fallback
  private renderGoogleButton(callback: (response: any) => void): void {
    // Create temporary container for Google button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '-9999px';
    buttonContainer.id = 'temp-google-btn';
    document.body.appendChild(buttonContainer);

    try {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: '100%',
      });

      // Auto-click the button
      setTimeout(() => {
        const button = buttonContainer.querySelector('[role="button"]') as HTMLElement;
        if (button) {
          button.click();
        }
        // Clean up
        document.body.removeChild(buttonContainer);
      }, 100);
    } catch (error) {
      console.error('❌ Error rendering Google button:', error);
      document.body.removeChild(buttonContainer);
      callback({ error: 'failed_to_render_button' });
    }
  }

  // Use the Redux thunk for login
  async login(credentials: LoginCredentials, dispatch: AppDispatch): Promise<void> {
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }

  // Register new user
  async register(credentials: RegisterCredentials, dispatch: AppDispatch): Promise<void> {
    try {
      dispatch(loginStart());

      const response = await fetch(`${this.baseURL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Registration successful - clear loading state without logging in
      dispatch(loginSuccess({ token: '', refreshToken: null }));
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }

  // Google Sign-In
  async loginWithGoogle(
    credential: string, 
    accountType: 'APPLICANT' | 'EMPLOYER',
    dispatch: AppDispatch
  ): Promise<void> {
    try {
      dispatch(loginStart());

      console.log('🔄 Sending Google login request...');
      
      const response = await fetch(`${this.baseURL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
          accountType,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.error || errorData.message || 'Google sign-in failed');
      }

      const data = await response.json();
      console.log('✅ Google login response:', data);

      // Store tokens
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // Update Redux state
      dispatch(loginSuccess({
        token: data.token,
        refreshToken: data.refreshToken || null,
      }));
      dispatch(setUser(data.user));

    } catch (error) {
      console.error('❌ Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }

  // Logout user
  async logout(dispatch: AppDispatch): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Notify backend (optional)
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(console.error);
      }
    } finally {
      // Clear everything
      dispatch(logout());
    }
  }

  // Get auth headers for API calls
  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user from API
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  // Generic API request method with auth headers
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle token expiration
    if (response.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
    
    return response;
  }
}

export default new AuthService();