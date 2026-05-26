import axios from 'axios'
import { getToken } from '@/utils/storage'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error.response?.data?.message || '网络错误'
    showToast(msg)
    return Promise.reject(error)
  }
)

export default request
