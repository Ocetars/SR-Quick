import { View, Text, Button, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Index () {
  const [uid, setUid] = useState<string>('')

  useLoad(() => {
    console.log('SR-Quick 星穹铁道速查工具加载完成')
  })

  const handleUidChange = (e: any) => {
    setUid(e.detail.value)
  }

  const searchPlayer = () => {
    if (!uid.trim()) {
      Taro.showToast({
        title: '请输入有效的UID',
        icon: 'error',
        duration: 2000
      })
      return
    }

    if (uid.trim().length !== 9) {
      Taro.showToast({
        title: 'UID必须为9位数字',
        icon: 'error', 
        duration: 2000
      })
      return
    }

    Taro.navigateTo({
      url: `/pages/detail/index?uid=${uid.trim()}`
    })
  }

  return (
    <View className='index'>
      {/* 顶部标题区域 */}
      <View className='index__header'>
        <View className='index__logo'>
          <Text className='index__logo-text'>⭐</Text>
        </View>
        <Text className='index__title'>星穹铁道</Text>
        <Text className='index__subtitle'>角色面板速查工具</Text>
      </View>

      {/* 主要功能区域 */}
      <View className='index__main'>
        <View className='index__search-card'>
          <Text className='index__search-title'>玩家信息查询</Text>
          
          <View className='index__input-section'>
            <View className='index__input-wrapper'>
              <Input
                className='index__uid-input'
                type='number'
                placeholder='请输入你的UID'
                value={uid}
                onInput={handleUidChange}
                maxlength={9}
              />
            </View>
            <Button 
              className='index__search-btn'
              type='primary'
              onClick={searchPlayer}
              disabled={!uid.trim()}
            >
              <Text className='index__search-btn-text'>查询面板</Text>
            </Button>
          </View>
        </View>
      </View>

      {/* 底部信息 */}
      <View className='index__footer'>
        <Text className='index__footer-text'>愿此行，终抵群星</Text>
      </View>
    </View>
  )
}
