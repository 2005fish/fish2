import request from './request'

export function getHistory(params: { page?: number; pageSize?: number } = {}) {
  return request.get('/history', { params })
}

export function saveHistory(data: { novel_id: number; chapter_id?: number; chapter_number?: number; progress?: number }) {
  return request.post('/history', data)
}
