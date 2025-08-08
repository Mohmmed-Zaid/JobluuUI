const signupValidation = (name: string, value: string): string => {
    switch (name) {
        case "name":
            if (value.length === 0) return "Name is required.";
            if (value.length < 2) return "Name must be at least 2 characters.";
            if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces.";
            return "";
        
        case "email":
            if (value.length === 0) return "Email is required.";
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) 
                return "Please enter a valid email address.";
            return "";
        
        case "password":
            if (value.length === 0) return "Password is required.";
            if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value))
                return "Password must be 8+ characters with uppercase, lowercase, number and special character.";
            return "";
        
        default:
            return "";
    }
};

export { signupValidation };