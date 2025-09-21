import axios, {AxiosInstance, AxiosError, AxiosRequestConfig} from 'axios';

// Add interface for better type safety
interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

class HttpService {
  http: AxiosInstance;
  authToken: string | null = null;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://dev3.xicomtechnologies.com/xttest',
      timeout: 10000,
    });

    this.interceptRequests();
    this.interceptResponse();
  }

  interceptRequests() {
    /**
     * axios request interceptors for debugging
     * and alter request data
     */
    this.http.interceptors.request.use(
      async reqConfig => {
        if (this.authToken) {
          reqConfig.headers.Authorization = `Bearer ${this.authToken}`;
        }
        console.log(`[Req] ${reqConfig.method?.toUpperCase()} ${reqConfig.url}`, reqConfig);
        return reqConfig;
      },
      error => Promise.reject(error),
    );
  }

  interceptResponse() {
    /**
     * Customize axios success and error
     * data to easily handle them in app
     */
    this.http.interceptors.response.use(
      response => {
        console.log(`[Res] ${response.config.url}`, response);
        return {...response, message: response.data.message};
      },
      (error: AxiosError & {config: any}) => this.handleApiError(error),
    );
  }

  async handleApiError(error: AxiosError & {config: any}) {
    const originalRequest = error.config;
    const isRefreshing = false;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = "";

      if (!refreshToken) {
        return Promise.reject({
          message: 'Session expired. Please login again.',
        });
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          // Add your queue logic here if needed
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;

      return new Promise(async (resolve, reject) => {
        try {
          const newAccessToken = "";
          this.setToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axios(originalRequest));
        } catch (refreshError) {
          reject({message: 'Session expired. Please login again.'});
        }
      });
    }

    return Promise.reject({
      message:
        (error.response?.data as {message?: string})?.message ||
        error.message ||
        'Unknown error occurred',
      status: error?.response?.status,
    });
  }

  setToken(token: string | null) {
    this.authToken = token;
  }

  getToken() {
    return this.authToken;
  }

  // ===== ENHANCED METHODS FOR DIFFERENT DATA TYPES =====

  /**
   * GET request with query parameters
   */
  async getData<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.http.get(url, { params });
  }

  /**
   * POST with FormData (multipart/form-data)
   */
  async postFormData<T = any>(url: string, formData: FormData, options?: {
    onUploadProgress?: (progressEvent: any) => void;
  }): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    };
    return this.http.post(url, formData, config);
  }

  /**
   * POST with URL-encoded data
   */
  async postUrlEncoded<T = any>(url: string, data: Record<string, any>): Promise<ApiResponse<T>> {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        params.append(key, String(data[key]));
      }
    });

    return this.http.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * POST with JSON data
   */
  async postJson<T = any>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.http.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Helper to create FormData from object
   */
  createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, String(item));
          });
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }
}

const httpService = new HttpService();
const request = httpService.http;

export {httpService, request};