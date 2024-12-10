import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

const apiEndpoint = process.env.REACT_APP_API_BACKEND

const createAxiosInstance = (contentType: string): AxiosInstance => {
  return axios.create({
    baseURL: apiEndpoint,
    headers: {
      'Content-Type': contentType,
    },
  })
}

const jsonInstance = createAxiosInstance('application/json')
const formdataInstance = createAxiosInstance('multipart/form-data')

const handleRequest = async <T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  instance: AxiosInstance,
  url: string,
  showToast?: (message: string, status: 'success' | 'error') => void,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const token = localStorage.getItem('accessToken')
    if (token) {
      instance.defaults.headers['Authorization'] = `Bearer ${token}`
    }
    let response: AxiosResponse<T>
    if (method === 'get' || method === 'delete') {
      response = await instance[method](url, config)
    } else {
      response = await instance[method](url, data, config)
    }

    showToast?.(`Successfully performed ${method.toUpperCase()} request`, 'success');
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 'An error occurred';
    showToast?.(errorMessage, 'error');
    console.error(`Error performing ${method.toUpperCase()} request:`, error)
    return error.response?.data?.detail
  }
}

export const api = {
  // JSON API
  async getJson<T>(
    url: string,
    showToast?: (message: string, status: 'success' | 'error') => void,
  ): Promise<T> {
    return handleRequest('get', jsonInstance, url, showToast)
  },

  async patchJson<T>(
    url: string,
    data: Record<string, any>,
    showToast?: (message: string, status: 'success' | 'error') => void,
  ): Promise<T> {
    return handleRequest('patch', jsonInstance, url, showToast, data)
  },

  async postJson<T>(
    url: string,
    data: Record<string, any>,
    showToast?: (message: string, status: 'success' | 'error') => void, 
  ): Promise<T> {
    return handleRequest('post', jsonInstance, url, showToast, data)
  },

  async deleteJson<T>(
    url: string,
    showToast?: (message: string, status: 'success' | 'error') => void,
  ): Promise<T> {
    return handleRequest('delete', jsonInstance, url, showToast)
  },

  // FormData API
  async postFormData<T>(
    url: string,
    formData: FormData,
    showToast?: (message: string, status: 'success' | 'error') => void,
  ): Promise<T> {
    return handleRequest('post', formdataInstance, url, showToast, formData)
  },
}