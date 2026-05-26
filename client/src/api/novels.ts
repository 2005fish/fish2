import request from './request'

export function getRecommend() {
  return request.get('/recommend')
}

export function getNovels(params: { page?: number; pageSize?: number; category_id?: number; status?: number; sort?: string } = {}) {
  return request.get('/novels', { params })
}

export function getNovelDetail(id: number | string) {
  return request.get(`/novels/${id}`)
}

export function getNovelChapters(id: number | string, params: { page?: number; pageSize?: number } = {}) {
  return request.get(`/novels/${id}/chapters`, { params })
}

export function getCategories() {
  return request.get('/categories')
}

export function getBanners() {
  return request.get('/banners')
}

export function searchNovels(q: string, params: { page?: number; pageSize?: number } = {}) {
  return request.get('/search', { params: { q, ...params } })
}
