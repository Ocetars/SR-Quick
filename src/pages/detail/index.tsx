import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { getPlayerInfo, showLoading, hideLoading, showError, type PlayerInfo } from '../../utils/api'
import './index.scss'

export default function Detail() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [uid, setUid] = useState<string>('')

  useLoad(() => {
    console.log('Player info page loaded.')
    // 获取URL参数中的UID
    const router = Taro.getCurrentInstance().router
    const paramUid = router?.params?.uid || ''
    if (paramUid) {
      setUid(paramUid)
      // 如果有UID参数，自动查询
      setTimeout(() => {
        fetchPlayerInfo(paramUid)
      }, 100)
    }
  })

  const fetchPlayerInfo = async (searchUid?: string) => {
    const targetUid = searchUid || uid.trim()
    if (!targetUid) {
      showError('请输入有效的UID')
      return
    }

    setLoading(true)
    setError('')
    setPlayerInfo(null)
    showLoading('获取玩家信息中...')
    
    try {
      const data = await getPlayerInfo(targetUid)
      setPlayerInfo(data)
      console.log('玩家信息获取成功:', data)
    } catch (err) {
      console.error('获取玩家信息失败:', err)
      const errorMessage = '获取玩家信息失败，请稍后重试'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      hideLoading()
    }
  }

  const goBack = () => {
    Taro.navigateBack()
  }

  const handleUidChange = (e: any) => {
    setUid(e.detail.value)
  }

  const handleSearch = () => {
    fetchPlayerInfo()
  }

  return (
    <View className='detail'>
      <View className='detail__header'>
        <Text className='detail__title'>玩家信息查询</Text>
      </View>

      {/* UID输入区域 */}
      <View className='detail__search'>
        <View className='detail__input-wrapper'>
          <Text className='detail__input-label'>请输入UID:</Text>
          <Input
            className='detail__input'
            type='number'
            placeholder='请输入9位UID'
            value={uid}
            onInput={handleUidChange}
            maxlength={9}
          />
        </View>
        <Button 
          className='detail__search-btn' 
          type='primary'
          onClick={handleSearch}
          disabled={loading || !uid.trim()}
        >
          {loading ? '查询中...' : '查询'}
        </Button>
      </View>

      {loading && (
        <View className='detail__loading'>
          <Text>加载中...</Text>
        </View>
      )}

      {error && (
        <View className='detail__error'>
          <Text className='detail__error-text'>{error}</Text>
          <Button className='detail__retry-btn' onClick={handleSearch}>
            重试
          </Button>
        </View>
      )}

      {!loading && !error && !playerInfo && uid && (
        <View className='detail__empty'>
          <Text>暂无玩家信息</Text>
        </View>
      )}

      {playerInfo && (
        <View className='detail__content'>
          {/* 基本信息卡片 */}
          <View className='detail__card'>
            <View className='detail__card-header'>
              <Text className='detail__card-title'>基本信息</Text>
            </View>
            <View className='detail__player-basic'>
              <View className='detail__avatar-section'>
                <Image
                  className='detail__avatar-icon'
                  src={playerInfo.avatar.icon}
                  mode='aspectFit'
                  onError={() => {
                    console.log('头像加载失败')
                  }}
                />
                <View className='detail__avatar-info'>
                  <Text className='detail__avatar-name'>{playerInfo.avatar.name}</Text>
                  <Text className='detail__avatar-id'>ID: {playerInfo.avatar.id}</Text>
                </View>
              </View>
              <View className='detail__basic-info'>
                <View className='detail__info-row'>
                  <Text className='detail__label'>UID:</Text>
                  <Text className='detail__value'>{playerInfo.uid}</Text>
                </View>
                <View className='detail__info-row'>
                  <Text className='detail__label'>昵称:</Text>
                  <Text className='detail__value'>{playerInfo.nickname}</Text>
                </View>
                <View className='detail__info-row'>
                  <Text className='detail__label'>等级:</Text>
                  <Text className='detail__value'>{playerInfo.level}</Text>
                </View>
                <View className='detail__info-row'>
                  <Text className='detail__label'>世界等级:</Text>
                  <Text className='detail__value'>{playerInfo.world_level}</Text>
                </View>
                <View className='detail__info-row'>
                  <Text className='detail__label'>好友数量:</Text>
                  <Text className='detail__value'>{playerInfo.friend_count}</Text>
                </View>
              </View>
            </View>
            {playerInfo.signature && (
              <View className='detail__signature'>
                <Text className='detail__signature-label'>签名:</Text>
                <Text className='detail__signature-text'>"{playerInfo.signature}"</Text>
              </View>
            )}
          </View>

          {/* 模拟宇宙信息卡片 */}
          <View className='detail__card'>
            <View className='detail__card-header'>
              <Text className='detail__card-title'>模拟宇宙</Text>
            </View>
            <View className='detail__memory-data'>
              <View className='detail__info-row'>
                <Text className='detail__label'>等级:</Text>
                <Text className='detail__value'>{playerInfo.space_info.memory_data.level}</Text>
              </View>
              <View className='detail__info-row'>
                <Text className='detail__label'>混沌回忆等级:</Text>
                <Text className='detail__value'>{playerInfo.space_info.memory_data.chaos_level}</Text>
              </View>
              <View className='detail__info-row'>
                <Text className='detail__label'>混沌回忆星数:</Text>
                <Text className='detail__value'>{playerInfo.space_info.memory_data.chaos_star_count}</Text>
              </View>
            </View>
          </View>

          {/* 收集统计卡片 */}
          <View className='detail__card'>
            <View className='detail__card-header'>
              <Text className='detail__card-title'>收集统计</Text>
            </View>
            <View className='detail__stats-grid'>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.avatar_count}</Text>
                <Text className='detail__stat-label'>角色</Text>
              </View>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.light_cone_count}</Text>
                <Text className='detail__stat-label'>光锥</Text>
              </View>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.relic_count}</Text>
                <Text className='detail__stat-label'>遗器</Text>
              </View>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.achievement_count}</Text>
                <Text className='detail__stat-label'>成就</Text>
              </View>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.book_count}</Text>
                <Text className='detail__stat-label'>图鉴</Text>
              </View>
              <View className='detail__stat-item'>
                <Text className='detail__stat-value'>{playerInfo.space_info.music_count}</Text>
                <Text className='detail__stat-label'>音乐</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <Button className='detail__back-btn' onClick={goBack}>
        返回
      </Button>
    </View>
  )
} 