import request from './request'

export function getBookshelf() {
  return request.get('/bookshelf')
}

export function addToBookshelf(novelId: number) {
  return request.post('/bookshelf', { novel_id: novelId })
}

export function removeFromBookshelf(novelId: number) {
  return request.delete(`/bookshelf/${novelId}`)
}

export function checkBookshelf(novelId: number) {
  return request.get(`/bookshelf/check/${novelId}`)
}
