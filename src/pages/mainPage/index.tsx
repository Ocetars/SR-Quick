import { View, Text } from "@tarojs/components";
import "./index.css";

export default function MainPage() {
  return (
    <View className="mainPage">
      {/* 底部信息 */}
      <View className="footer">
        <Text className="footerText">群星</Text>
      </View>
    </View>
  );
}
