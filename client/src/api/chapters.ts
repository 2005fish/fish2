import request from './request'

export function getChapter(id: number | string) {
  return request.get(`/chapters/${id}`)
}
