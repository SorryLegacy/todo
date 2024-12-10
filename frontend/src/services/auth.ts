import { api } from "./api";

interface User {
    id: string
    email: string
    updated_at: string
    created_at: string
}

interface TokenSuccessResponse {
  access_token: string;
}

type TokenResponse = TokenSuccessResponse | string;


const authService = {
    async userMe<T>(): Promise<User> {
        const user = await api.getJson<User>('/api/v1/me')
        return user
    },
    
    async loginUser<T>(
        login: string,
        password: string,
        showToast?: (message: string, status: 'success' | 'error') => void,
      ): Promise<TokenResponse> {
        try {
          const formData = new FormData()
          formData.append('username', login)
          formData.append('password', password)
          const user_data = await api.postFormData<TokenResponse>(
            '/api/v1/login',
            formData,
          )
          if (showToast){
            if (typeof user_data === 'object' && user_data !== null && 'access_token' in user_data) {
              showToast('Login successful', 'success');
              } else {
                showToast(user_data, 'error');
              }
          }
          return user_data
        } catch (error) {
          if (showToast) showToast('Login failed', 'error')
          throw error
        }
      },

      async signUp<T>(
        email: string,
        password: string,
        confirm_password: string,
        showToast?: (message: string, status: 'success' | 'error') => void,
      ): Promise<TokenResponse> {
        try {
          const response = await api.postJson<TokenResponse>('/api/v1/sign-up', {
            email,
            password,
            confirm_password
          })
          if (showToast){
            if (typeof response === 'object' && response !== null && 'access_token' in response) {
              showToast('Login successful', 'success');
              } else {
                showToast(response, 'error');
              }
          }          
          return response
        } catch (error) {
          if (showToast) showToast('Sign up failed', 'error')
          throw error
        }
      },

} 

export default authService;
