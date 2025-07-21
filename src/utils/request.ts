import Taro from '@tarojs/taro'

// API 基础配置
// export const API_BASE_URL = 'https://express-sf1m-173672-5-1369600074.sh.run.tcloudbase.com'
export const API_TIMEOUT = 10000

// 云托管配置
export const CLOUD_CONFIG = {
  env: 'prod-6g8xwsfab2293eb4',
  serviceName: 'express-sf1m'
}

/**
 * 云托管请求封装
 */
export const cloudRequest = async (path: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
  return await Taro.cloud.callContainer({
    config: {
      env: CLOUD_CONFIG.env
    },
    path,
    method,
    data,
    header: {
      'X-WX-SERVICE': CLOUD_CONFIG.serviceName,
      'Content-Type': 'application/json'
    },
    timeout: API_TIMEOUT
  })
}
