export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Akubueze"
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "The 90's begins here."
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const signInDefaultValues = {
    email: '',
    password: '',
  };
  
  export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };

  export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

  export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['ADMIN', 'MEMBER', 'FINANCIAL_SECRETARY'];
