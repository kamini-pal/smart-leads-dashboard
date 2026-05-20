import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

/**
 * Auth Service — all authentication API calls in one place.
 *
 * WHY a separate service file?
 * Controllers (components) shouldn't know about HTTP details.
 * The service handles the API call, the component handles the UI.
 *
 * Component → Service → Axios Instance → Backend
 *    UI         API call     Headers/URL     Server
 */

export const authService = {
  /**
   * Login — sends credentials to backend, returns user + token.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Register — creates a new user account.
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
  },
};
