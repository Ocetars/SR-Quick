import { PlayerInfo, FormattedApiInfo } from '../types/APIinfo'
import { Smartrequest } from './request'
import { getMockPlayerInfo } from './mock'

/**
 * 获取玩家信息 - 云托管版本
 * @param uid 玩家UID
 * @returns Promise<PlayerInfo>
 */
export const getPlayerInfo = async (uid: string): Promise<PlayerInfo> => {
  try {
    const response = await Smartrequest(`/api/player/${uid}/info`)

    if (response.statusCode === 200) {
      return response.data as PlayerInfo
    } else {
      throw new Error(`云托管API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('获取玩家信息失败 (云托管版本):', error)
    return getMockPlayerInfo(uid)
  }
}

/**
 * 获取全部信息 - 云托管版本
 * @param uid 玩家UID
 * @returns Promise<FormattedApiInfo>
 */
export const getAllInfo = async (uid: string): Promise<FormattedApiInfo> => {
  try {
    const response = await Smartrequest(`/api/player/${uid}/all`)

    if (response.statusCode === 200) {
      return response.data as FormattedApiInfo
    } else {
      throw new Error(`云托管API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('获取全部信息失败 (云托管版本):', error)
    throw error
  }
}


