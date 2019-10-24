import request from '@/utils/request'

export function getOrders(params) {
  return request({
    url: '/order',
    method: 'get',
    params
  })
}
export function assignOrder(data) {
  console.log(`data: ${data} | params: ${data.type}`)
  return request({
    url: `/order/assign-driver/${data.type}`,
    method: 'post',
    data
  })
}
export function updateOrder(data) {
  return request({
    url: '/order',
    method: 'patch',
    data
  })
}
export function applyPenalty(params) {
  return request({
    url: `/order/apply-absent-penalty/${params}`,
    method: 'post'
  })
}
