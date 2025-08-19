import { View, Text, Button } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Sync() {
  useLoad(() => {
    console.log("数据同步页面加载");
  });

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="sync">
      <View className="sync__header">
        <Text className="sync__title">数据同步</Text>
      </View>

      <View className="sync__content">
        <View className="sync__coming-soon">
          <Text className="sync__coming-icon">🔄</Text>
          <Text className="sync__coming-title">功能开发中</Text>
          <Text className="sync__coming-subtitle">数据同步功能即将上线</Text>
        </View>
      </View>

      <Button className="sync__back-btn" onClick={goBack}>
        返回
      </Button>
    </View>
  );
}
