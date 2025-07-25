import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Characters() {
  useLoad(() => {
    console.log('我的角色页面加载')
  })

  const goBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='characters'>
      <View className='characters__header'>
        <Text className='characters__title'>我的角色</Text>
      </View>

      <View className='characters__content'>
        <View className='characters__coming-soon'>
          <Text className='characters__coming-icon'>⭐</Text>
          <Text className='characters__coming-title'>功能开发中</Text>
          <Text className='characters__coming-subtitle'>角色收藏功能即将上线</Text>
        </View>
      </View>

      <Button className='characters__back-btn' onClick={goBack}>
        返回
      </Button>
    </View>
  )
}