import { View, Text, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Account() {
  useLoad(() => {
    console.log("账号管理页面加载");
  });

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="account">
      <View className="account__header">
        <Text className="account__title">账号管理</Text>
      </View>

      <View className="account__content">
        <View className="account__coming-soon">
          <Text className="account__coming-icon">🎮</Text>
          <Text className="account__coming-title">功能开发中</Text>
          <Text className="account__coming-subtitle">
            游戏账号管理功能即将上线
          </Text>
        </View>
      </View>

      <Button className="account__back-btn" onClick={goBack}>
        返回
      </Button>
    </View>
  );
}
