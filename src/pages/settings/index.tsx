import { View, Text, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Settings() {
  useLoad(() => {
    console.log("设置页面加载");
  });

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="settings">
      <View className="settings__header">
        <Text className="settings__title">设置</Text>
      </View>

      <View className="settings__content">
        <View className="settings__coming-soon">
          <Text className="settings__coming-icon">⚙️</Text>
          <Text className="settings__coming-title">功能开发中</Text>
          <Text className="settings__coming-subtitle">
            更多个性化设置即将上线
          </Text>
        </View>
      </View>

      <Button className="settings__back-btn" onClick={goBack}>
        返回
      </Button>
    </View>
  );
}
