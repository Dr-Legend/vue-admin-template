import request from '@/utils/request'

export function getSlots(params) {
  return request({
    url: '/slot',
    method: 'get',
    params
  })
}
export function updateSlots(data) {
  return request({
    url: '/slot',
    method: 'post',
    data
  })
}
export function deleteSlots(params) {
  return request({
    url: '/slot',
    method: 'delete',
    params
  })
}
export function addSlots(data) {
  return request({
    url: '/slot',
    method: 'post',
    data
  })
}
