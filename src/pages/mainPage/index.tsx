import { View, Text } from "@tarojs/components";
import "./index.scss";

export default function MainPage() {
  return (
    <View>
      {/* 底部信息 */}
      <View className="main-page__footer">
        <Text className="main-page__footer-text">愿此行，终抵群星</Text>
      </View>
    </View>
  );
}
