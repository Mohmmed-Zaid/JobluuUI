import axios from "axios";

const base_url = "http://localhost:8080/api/users/";

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

const registerUser = async (user: any) => {
    try {
        console.log('Sending registration data:', user);
        const response = await axios.post(`${base_url}register`, user);
        return response.data;
    } catch (error: any) {
        console.error('Registration error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Registration failed' };
    }
};

const loginUser = async (login: any) => {
    try {
        console.log('Sending login data:', login);
        const response = await axios.post(`${base_url}login`, login);
        return response.data;
    } catch (error: any) {
        console.error('Login error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Login failed' };
    }
};

// Fixed: This should match your ResetPassword component's API call
const sentOtp = async (email: string) => {
    try {
        console.log('Sending OTP to email:', email);
        // This matches the API call in your ResetPassword component
        const response = await axios.post(`${base_url}sendOTP/${email}`);
        return response.data;
    } catch (error: any) {
        console.error('Send OTP error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Failed to send OTP' };
    }
};

// Fixed: Removed extra space in URL
const verifyOtp = async (email: string, otp: string) => {
    try {
        console.log('Verifying OTP for email:', email, 'OTP:', otp);
        // Removed the extra space before verifyOtp
        const response = await axios.get(`${base_url}verifyOtp/${email}/${otp}`);
        return response.data;
    } catch (error: any) {
        console.error('Verify OTP error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Failed to verify OTP' };
    }
};

// Fixed: Removed extra space in URL
const changePass = async (email: string, password: string) => {
    try {
        console.log('Changing password for email:', email);
        // Removed the extra space before changePass
        const response = await axios.post(`${base_url}changePass`, { email, password });
        return response.data;
    } catch (error: any) {
        console.error('Change password error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw { message: error.message || 'Failed to change password' };
    }
};

export { registerUser, loginUser, sentOtp, verifyOtp, changePass };