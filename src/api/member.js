
import request from '@/utils/request'

export function getMembers(params) {
  return request({
    url: '/member',
    method: 'get',
    params
  })
}

