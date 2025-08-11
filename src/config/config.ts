// config/config.ts
interface Config {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  googleClientId: string;
}

const getConfig = (): Config => {
  const hostname = window.location.hostname;

  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  const isStaging = !isDevelopment && (hostname.includes('staging') || hostname.includes('dev'));

  if (isDevelopment) {
    return {
      apiUrl: 'https://jobluubackend.onrender.com/api',
      environment: 'development',
      googleClientId: '415838507936-um9s5pbvbubp1hs2k84lvjmsph4e38m3.apps.googleusercontent.com'
    };
  }

  if (isStaging) {
    return {
      apiUrl: 'https://jobluubackend.onrender.com/api',
      environment: 'staging',
      googleClientId: 'STAGING_CLIENT_ID'
    };
  }

  return {
    apiUrl: 'https://jobluubackend.onrender.com/api',
    environment: 'production',
    googleClientId: '415838507936-um9s5pbvbubp1hs2k84lvjmsph4e38m3.apps.googleusercontent.com'
  };
};

export const config = getConfig();
