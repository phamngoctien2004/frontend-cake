export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/login',
            REGISTER: '/api/register',
            LOGOUT: '/api/logout',
            FORGOT_PASSWORD: '/api/password/forgot',
            RESET_PASSWORD: '/api/password/reset'
        },
        USERS: {
            BASE: '/api/users',
            PROFILE: '/api/users/profile'
        }
    }
};

export const APP_CONFIG = {
    PAGE_SIZE: 10,
    DATE_FORMAT: 'dd/MM/yyyy',
    CURRENCY: 'VND',
    LANGUAGES: ['vi', 'en']
};

export const AUTH_CONFIG = {
    TOKEN_KEY: 'access_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRES_IN: 3600 // seconds
};
