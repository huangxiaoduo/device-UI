export function getEnableTheme() {
  return request({
    method: 'get',
    url: '/ewc2theme/getEnableTheme/v1'
  })
}