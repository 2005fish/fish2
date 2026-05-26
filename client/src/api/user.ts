import request from './request'

export function login(username: string, password: string) {
  return request.post('/auth/login', { username, password })
}

export function register(username: string, password: string, nickname: string) {
  return request.post('/auth/register', { username, password, nickname })
}

export function getProfile() {
  return request.get('/auth/profile')
}
