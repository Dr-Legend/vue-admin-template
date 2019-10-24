
import request from '@/utils/request'

export function getArticles(params) {
  return request({
    url: '/article',
    method: 'get',
    params
  })
}
export function getArticlesById(params) {
  return request({
    url: `/member/${params.id}`,
    method: 'get',
    params
  })
}
