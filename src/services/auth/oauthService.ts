import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { authApi } from '../api/auth';

// Ensure WebBrowser cleanup on Android
WebBrowser.maybeCompleteAuthSession();

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authorizationEndpoint: string;
  tokenEndpoint?: string;
}

// OAuth configurations for each provider
const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'newsgenie',
    }),
    scopes: ['openid', 'profile', 'email'],
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
  apple: {
    clientId: 'YOUR_APPLE_CLIENT_ID',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'newsgenie',
    }),
    scopes: ['name', 'email'],
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
  },
  facebook: {
    clientId: 'YOUR_FACEBOOK_APP_ID',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'newsgenie',
    }),
    scopes: ['public_profile', 'email'],
    authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth',
  },
};

export const oauthService = {
  /**
   * Initiate OAuth flow for a given provider
   */
  authenticate: async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const config = OAUTH_CONFIGS[provider];
      
      if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
      }

      // Create authorization request
      const authRequest = new AuthSession.AuthRequest({
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        scopes: config.scopes,
        responseType: AuthSession.ResponseType.Token,
        usePKCE: provider === 'google', // Use PKCE for Google
      });

      // Prompt for authentication
      const result = await authRequest.promptAsync({
        authorizationEndpoint: config.authorizationEndpoint,
      });

      if (result.type === 'success') {
        const { access_token, id_token } = result.params;
        
        // Use id_token for authentication with backend
        const token = id_token || access_token;
        
        // Send token to backend for verification and user creation/login
        const loginResponse = await authApi.oauthLogin(provider, token);
        
        return {
          success: true,
          user: loginResponse.user,
          token: loginResponse.token,
        };
      } else if (result.type === 'error') {
        throw new Error(result.params.error_description || 'Authentication failed');
      } else {
        // User cancelled
        return {
          success: false,
          cancelled: true,
        };
      }
    } catch (error) {
      console.error(`OAuth error for ${provider}:`, error);
      throw error;
    }
  },

  /**
   * Get the appropriate OAuth provider based on platform
   */
  getPrimaryProvider: (): 'apple' | 'google' => {
    return Platform.OS === 'ios' ? 'apple' : 'google';
  },

  /**
   * Check if a provider is available on the current platform
   */
  isProviderAvailable: (provider: 'google' | 'apple' | 'facebook'): boolean => {
    // Apple Sign In is only available on iOS
    if (provider === 'apple' && Platform.OS !== 'ios') {
      return false;
    }
    return true;
  },

  /**
   * Mock authentication for development
   * Remove this in production
   */
  mockAuthenticate: async (provider: 'google' | 'apple' | 'facebook') => {
    console.log(`[DEV] Mock authenticating with ${provider}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock user data
    return {
      success: true,
      user: {
        id: `mock-${provider}-user-${Date.now()}`,
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: undefined,
        createdAt: new Date().toISOString(),
      },
      token: `mock-token-${Date.now()}`,
    };
  },
};
