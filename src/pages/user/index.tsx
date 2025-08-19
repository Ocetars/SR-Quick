import { View, Text, Button, Image } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { useUser, useUserData } from "../../stores/userStore";
import { userUtils } from "../../utils/userAPI";
import "./index.scss";

export default function User() {
  const {
    user,
    gameAccounts,
    isLoggedIn,
    isLoading,
    error,
    currentAccount,
    login,
    logout,
    checkLoginStatus,
    clearError,
    getPrimaryAccount,
  } = useUser();

  const { characters, lastSyncTime, getCharacters, clearSyncData } =
    useUserData();

  const [stats, setStats] = useState({
    charactersCount: 0,
    favoriteCount: 0,
    lastSyncTimeFormatted: "未同步",
  });

  useLoad(() => {
    console.log("用户中心页面加载");
    // 检查登录状态
    checkLoginStatus();
  });

  useDidShow(() => {
    // 页面显示时刷新数据
    if (isLoggedIn && currentAccount) {
      refreshUserData();
    }
  });

  // 刷新用户数据
  const refreshUserData = async () => {
    if (!currentAccount) return;

    try {
      await getCharacters(currentAccount.uid);
    } catch (error) {
      console.error("刷新用户数据失败:", error);
    }
  };

  // 更新统计信息
  useEffect(() => {
    if (characters.length > 0) {
      setStats({
        charactersCount: characters.length,
        favoriteCount: characters.filter((char) => char.is_favorite).length,
        lastSyncTimeFormatted: lastSyncTime
          ? userUtils.formatSyncTime(lastSyncTime)
          : "未同步",
      });
    }
  }, [characters, lastSyncTime]);

  // 处理登录
  const handleLogin = async () => {
    clearError();
    const success = await login();
    if (success) {
      // 登录成功后获取数据
      refreshUserData();
    }
  };

  // 处理登出
  const handleLogout = () => {
    Taro.showModal({
      title: "确认退出",
      content: "退出登录后将清除本地数据，确定要退出吗？",
      success: (res) => {
        if (res.confirm) {
          logout();
          clearSyncData();
        }
      },
    });
  };

  // 跳转到数据同步页面
  const goToSync = () => {
    if (!currentAccount) {
      Taro.showToast({
        title: "请先添加游戏账号",
        icon: "error",
      });
      return;
    }

    Taro.navigateTo({
      url: "/pages/sync/index",
    });
  };

  // 跳转到设置页面
  const goToSettings = () => {
    Taro.navigateTo({
      url: "/pages/settings/index",
    });
  };

  // 跳转到账号管理页面
  const goToAccountManage = () => {
    Taro.navigateTo({
      url: "/pages/account/index",
    });
  };

  // 跳转到我的角色页面
  const goToMyCharacters = () => {
    if (!currentAccount) {
      Taro.showToast({
        title: "请先添加游戏账号",
        icon: "error",
      });
      return;
    }

    Taro.navigateTo({
      url: "/pages/characters/index",
    });
  };

  // 如果未登录，显示登录界面
  if (!isLoggedIn) {
    return (
      <View className="user">
        <View className="user__login-container">
          <View className="user__login-card">
            <View className="user__logo">
              <Text className="user__logo-text">⭐</Text>
            </View>
            <Text className="user__login-title">欢迎使用 SR-Quick</Text>
            <Text className="user__login-subtitle">
              登录后可以云端保存角色面板数据
            </Text>

            <View className="user__login-features">
              <View className="user__feature-item">
                <Text className="user__feature-icon">☁️</Text>
                <Text className="user__feature-text">云端数据同步</Text>
              </View>
              <View className="user__feature-item">
                <Text className="user__feature-icon">📱</Text>
                <Text className="user__feature-text">多设备数据共享</Text>
              </View>
              <View className="user__feature-item">
                <Text className="user__feature-icon">⭐</Text>
                <Text className="user__feature-text">角色收藏管理</Text>
              </View>
              <View className="user__feature-item">
                <Text className="user__feature-icon">📊</Text>
                <Text className="user__feature-text">数据统计分析</Text>
              </View>
            </View>

            <Button
              className="user__login-btn"
              type="primary"
              onClick={handleLogin}
              loading={isLoading}
            >
              {isLoading ? "登录中..." : "立即登录"}
            </Button>

            {error && (
              <View className="user__error">
                <Text className="user__error-text">{error}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // 已登录用户界面
  return (
    <View className="user">
      {/* 用户信息卡片 */}
      <View className="user__profile-card">
        <View className="user__avatar-section">
          {user?.avatar_url ? (
            <Image
              className="user__avatar"
              src={user.avatar_url}
              mode="aspectFill"
            />
          ) : (
            <View className="user__avatar user__avatar--placeholder">
              <Text className="user__avatar-text">
                {user?.nickname?.charAt(0) || "用"}
              </Text>
            </View>
          )}

          <View className="user__info">
            <Text className="user__nickname">
              {user?.nickname || "星穹旅者"}
            </Text>
            <Text className="user__uid">
              {currentAccount
                ? `主账号：${currentAccount.uid}`
                : "未添加游戏账号"}
            </Text>
            {currentAccount && (
              <Text className="user__level">
                Lv.{currentAccount.level || 0} | 世界等级{" "}
                {currentAccount.world_level || 0}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* 数据统计卡片 */}
      <View className="user__stats-card">
        <Text className="user__card-title">数据统计</Text>
        <View className="user__stats-grid">
          <View className="user__stat-item">
            <Text className="user__stat-value">{gameAccounts.length}</Text>
            <Text className="user__stat-label">游戏账号</Text>
          </View>
          <View className="user__stat-item">
            <Text className="user__stat-value">{stats.charactersCount}</Text>
            <Text className="user__stat-label">角色数据</Text>
          </View>
          <View className="user__stat-item">
            <Text className="user__stat-value">{stats.favoriteCount}</Text>
            <Text className="user__stat-label">收藏角色</Text>
          </View>
        </View>

        <View className="user__sync-info">
          <Text className="user__sync-text">
            最后同步：{stats.lastSyncTimeFormatted}
          </Text>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="user__menu-card">
        <View className="user__menu-item" onClick={goToMyCharacters}>
          <View className="user__menu-icon">👥</View>
          <View className="user__menu-content">
            <Text className="user__menu-title">我的角色</Text>
            <Text className="user__menu-subtitle">查看收藏的角色面板</Text>
          </View>
          <View className="user__menu-arrow">›</View>
        </View>

        <View className="user__menu-item" onClick={goToSync}>
          <View className="user__menu-icon">🔄</View>
          <View className="user__menu-content">
            <Text className="user__menu-title">数据同步</Text>
            <Text className="user__menu-subtitle">同步最新角色面板数据</Text>
          </View>
          <View className="user__menu-arrow">›</View>
        </View>

        <View className="user__menu-item" onClick={goToAccountManage}>
          <View className="user__menu-icon">🎮</View>
          <View className="user__menu-content">
            <Text className="user__menu-title">账号管理</Text>
            <Text className="user__menu-subtitle">管理游戏账号和设置</Text>
          </View>
          <View className="user__menu-arrow">›</View>
        </View>

        <View className="user__menu-item" onClick={goToSettings}>
          <View className="user__menu-icon">⚙️</View>
          <View className="user__menu-content">
            <Text className="user__menu-title">设置</Text>
            <Text className="user__menu-subtitle">个性化设置和偏好</Text>
          </View>
          <View className="user__menu-arrow">›</View>
        </View>
      </View>

      {/* 退出登录按钮 */}
      <View className="user__logout-section">
        <Button
          className="user__logout-btn"
          onClick={handleLogout}
          disabled={isLoading}
        >
          退出登录
        </Button>
      </View>

      {/* 错误提示 */}
      {error && (
        <View className="user__error">
          <Text className="user__error-text">{error}</Text>
          <Button className="user__error-btn" size="mini" onClick={clearError}>
            关闭
          </Button>
        </View>
      )}
    </View>
  );
}
