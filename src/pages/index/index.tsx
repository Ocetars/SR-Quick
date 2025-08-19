import { View, Text, Button, Input } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { useUser } from "../../stores/userStore";
import "./index.scss";

export default function Index() {
  const [uid, setUid] = useState<string>("");
  const { user, isLoggedIn, currentAccount, checkLoginStatus } = useUser();

  useLoad(() => {
    console.log("SR-Quick 加载完成");
    checkLoginStatus();
  });

  useDidShow(() => {
    // 页面显示时检查登录状态
    checkLoginStatus();
  });

  const handleUidChange = (e: any) => {
    setUid(e.detail.value);
  };

  const searchPlayer = () => {
    const targetUid = uid.trim();

    if (!targetUid) {
      Taro.showToast({
        title: "请输入有效的UID",
        icon: "error",
        duration: 2000,
      });
      return;
    }

    if (targetUid.length !== 9) {
      Taro.showToast({
        title: "UID必须为9位数字",
        icon: "error",
        duration: 2000,
      });
      return;
    }

    Taro.navigateTo({
      url: `/pages/detail/index?uid=${targetUid}`,
    });
  };

  // 快速查询当前用户的角色面板
  const searchMyCharacter = () => {
    if (!currentAccount) {
      Taro.showToast({
        title: "请先登录并添加游戏账号",
        icon: "error",
      });
      return;
    }

    Taro.navigateTo({
      url: `/pages/detail/index?uid=${currentAccount.uid}`,
    });
  };

  // 跳转到用户中心
  const goToUserCenter = () => {
    Taro.navigateTo({
      url: "/pages/user/index",
    });
  };

  // 使用当前账号UID
  const useCurrentAccountUID = () => {
    if (currentAccount) {
      setUid(currentAccount.uid);
    }
  };

  return (
    <View className="index">
      {/* 顶部用户区域 */}
      <View className="index__user-header">
        <View className="index__user-info" onClick={goToUserCenter}>
          {isLoggedIn ? (
            <View className="index__user-logged">
              <View className="index__user-avatar">
                <Text className="index__user-avatar-text">
                  {user?.nickname?.charAt(0) || "用"}
                </Text>
              </View>
              <View className="index__user-details">
                <Text className="index__user-name">
                  {user?.nickname || "星穹旅者"}
                </Text>
                {currentAccount ? (
                  <Text className="index__user-uid">
                    UID: {currentAccount.uid}
                  </Text>
                ) : (
                  <Text className="index__user-uid">未绑定游戏账号</Text>
                )}
              </View>
            </View>
          ) : (
            <View className="index__user-login-tip">
              <Text className="index__login-text">点击登录</Text>
              <Text className="index__login-subtitle">享受云端数据同步</Text>
            </View>
          )}
        </View>
      </View>

      {/* 主体内容区域 */}
      <View className="index__content">
        {/* Logo区域 */}
        <View className="index__header">
          <View className="index__logo">
            <Text className="index__logo-text">⭐</Text>
          </View>
          <Text className="index__title">星穹铁道</Text>
          <Text className="index__subtitle">角色面板速查工具</Text>
        </View>

        {/* 主要功能区域 */}
        <View className="index__main">
          <View className="index__search-card">
            <Text className="index__search-title">玩家信息查询</Text>

            <View className="index__input-section">
              <View className="index__input-wrapper">
                <Input
                  className="index__uid-input"
                  type="number"
                  placeholder="请输入你的UID"
                  value={uid}
                  onInput={handleUidChange}
                  maxlength={9}
                />
                {currentAccount && (
                  <Button
                    className="index__use-current-btn"
                    size="mini"
                    onClick={useCurrentAccountUID}
                  >
                    使用我的UID
                  </Button>
                )}
              </View>
              <Button
                className="index__search-btn"
                type="primary"
                onClick={searchPlayer}
                disabled={!uid.trim()}
              >
                <Text className="index__search-btn-text">查询面板</Text>
              </Button>
            </View>
          </View>

          {/* 快捷功能区域 */}
          {isLoggedIn && (
            <View className="index__quick-actions">
              <Text className="index__quick-title">快捷功能</Text>
              <View className="index__quick-buttons">
                <Button
                  className="index__quick-btn"
                  onClick={searchMyCharacter}
                  disabled={!currentAccount}
                >
                  <Text className="index__quick-btn-icon">👤</Text>
                  <Text className="index__quick-btn-text">查看我的面板</Text>
                </Button>

                <Button
                  className="index__quick-btn"
                  onClick={() => Taro.navigateTo({ url: "/pages/sync/index" })}
                  disabled={!currentAccount}
                >
                  <Text className="index__quick-btn-icon">🔄</Text>
                  <Text className="index__quick-btn-text">同步数据</Text>
                </Button>

                <Button
                  className="index__quick-btn"
                  onClick={() =>
                    Taro.navigateTo({ url: "/pages/characters/index" })
                  }
                  disabled={!currentAccount}
                >
                  <Text className="index__quick-btn-icon">⭐</Text>
                  <Text className="index__quick-btn-text">我的收藏</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 底部信息 */}
      <View className="index__footer">
        <Text className="index__footer-text">愿此行，终抵群星</Text>
      </View>
    </View>
  );
}
