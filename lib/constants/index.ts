export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Akubueze"
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "The 90's begins here."
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const signInDefaultValues = {
    email: 'admin@akubueze.com',
    password: 'admin123',
  };
  
  export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };