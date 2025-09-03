import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../config/api';
import { User, AuthResponse } from '../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  age?: number;
  birthday?: string;
  weight?: number;
  height?: number;
}

const TOKEN_KEY = 'sympcheck_token';
const USER_KEY = 'sympcheck_user';

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(getApiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    await this.storeAuthData(data.data.token, data.data.user);
    
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(getApiUrl('/api/v1/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    await this.storeAuthData(data.data.token, data.data.user);
    
    return data;
  }

  async logout(): Promise<void> {
    this.token = null;
    this.user = null;
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  async getStoredAuthData(): Promise<{ token: string | null; user: User | null }> {
    try {
      const [token, userJson] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
      
      this.token = token[1];
      this.user = userJson[1] ? JSON.parse(userJson[1]) : null;
      
      return { token: this.token, user: this.user };
    } catch (error) {
      console.error('Error getting stored auth data:', error);
      return { token: null, user: null };
    }
  }

  private async storeAuthData(token: string, user: User): Promise<void> {
    this.token = token;
    this.user = user;
    
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!(this.token && this.user);
  }

  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(getApiUrl('/api/v1/auth/profile'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    const data = await response.json();
    return data.data.user;
  }

  async updateProfile(updates: { name?: string; age?: number; birthday?: string; weight?: number; height?: number }): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(getApiUrl('/api/v1/auth/profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    const data = await response.json();
    
    this.user = data.data.user;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(this.user));
    
    return data.data.user;
  }
}

export default new AuthService();
