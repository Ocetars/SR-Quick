import Taro from '@tarojs/taro'

// API 基础配置
const API_BASE_URL = 'https://express-sf1m-173672-5-1369600074.sh.run.tcloudbase.com'
const API_TIMEOUT = 10000

// 云托管配置
const CLOUD_CONFIG = {
  env: 'prod-6g8xwsfab2293eb4',
  serviceName: 'express-sf1m'
}

export interface PlayerInfo {
  uid: string
  nickname: string
  level: number
  world_level: number
  friend_count: number
  avatar: {
    id: string
    name: string
    icon: string
  }
  signature: string
  is_display: boolean
  space_info: {
    memory_data: {
      level: number
      chaos_id: null
      chaos_level: number
      chaos_star_count: number
    }
    universe_level: number
    avatar_count: number
    light_cone_count: number
    relic_count: number
    achievement_count: number
    book_count: number
    music_count: number
  }
}

/**
 * 获取玩家信息 - 云托管版本
 * @param uid 玩家UID
 * @returns Promise<PlayerInfo>
 */
export const getPlayerInfo = async (uid: string): Promise<PlayerInfo> => {
  try {
    const response = await Taro.cloud.callContainer({
      config: {
        env: CLOUD_CONFIG.env
      },
      path: `/api/player/${uid}/info`,
      method: 'GET',
      header: {
        'X-WX-SERVICE': CLOUD_CONFIG.serviceName,
        'Content-Type': 'application/json'
      },
      timeout: API_TIMEOUT
    })

    if (response.statusCode === 200) {
      return response.data as PlayerInfo
    } else {
      throw new Error(`云托管API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('获取玩家信息失败 (云托管版本):', error)
    
    // 返回模拟数据以便开发和测试
    return {
      uid: uid,
      nickname: "旅行者",
      level: 60,
      world_level: 8,
      friend_count: 45,
      avatar: {
        id: "8001",
        name: "三月七",
        icon: "https://example.com/avatar.png"
      },
      signature: "愿此行，终抵群星。",
      is_display: true,
      space_info: {
        memory_data: {
          level: 12,
          chaos_id: null,
          chaos_level: 10,
          chaos_star_count: 36
        },
        universe_level: 8,
        avatar_count: 28,
        light_cone_count: 15,
        relic_count: 180,
        achievement_count: 520,
        book_count: 85,
        music_count: 42
      }
    }
  }
}

/**
 * 获取玩家信息 - 原始HTTP版本 (备用)
 * @param uid 玩家UID
 * @returns Promise<PlayerInfo>
 */
export const getPlayerInfoHTTP = async (uid: string): Promise<PlayerInfo> => {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/api/player/${uid}/info`,
      method: 'GET',
      timeout: API_TIMEOUT,
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (response.statusCode === 200) {
      return response.data as PlayerInfo
    } else {
      throw new Error(`API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('获取玩家信息失败:', error)
    
    // 返回模拟数据以便开发和测试
    return {
      uid: uid,
      nickname: "旅行者",
      level: 60,
      world_level: 8,
      friend_count: 45,
      avatar: {
        id: "8001",
        name: "三月七",
        icon: "https://example.com/avatar.png"
      },
      signature: "愿此行，终抵群星。",
      is_display: true,
      space_info: {
        memory_data: {
          level: 12,
          chaos_id: null,
          chaos_level: 10,
          chaos_star_count: 36
        },
        universe_level: 8,
        avatar_count: 28,
        light_cone_count: 15,
        relic_count: 180,
        achievement_count: 520,
        book_count: 85,
        music_count: 42
      }
    }
  }
}

/**
 * 显示加载提示
 */
export const showLoading = (title = '加载中...') => {
  Taro.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  Taro.hideLoading()
}

/**
 * 显示错误提示
 */
export const showError = (message: string) => {
  Taro.showToast({
    title: message,
    icon: 'error',
    duration: 2000
  })
}

/**
 * 显示成功提示
 */
export const showSuccess = (message: string) => {
  Taro.showToast({
    title: message,
    icon: 'success',
    duration: 2000
  })
} 