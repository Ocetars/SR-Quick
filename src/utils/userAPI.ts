import {
  User,
  UserGameAccount,
  UserSettings,
  UserCharacterData,
  UserProfile,
  UserStats,
  SyncLog,
  LoginResponse,
  SyncRequest,
  SyncResponse,
} from "../types/user";
import { Smartrequest } from "./request";
import Taro from "@tarojs/taro";

// 基础URL配置
const API_BASE = "/api";

/**
 * 用户认证相关API
 */
export const userAuthAPI = {
  /**
   * 用户登录（自动登录，基于微信云托管）
   */
  login: async (): Promise<LoginResponse> => {
    const response = await Smartrequest(`${API_BASE}/auth/login`);
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as LoginResponse;
    } else {
      throw new Error(response.data.error || "登录失败");
    }
  },

  /**
   * 获取用户信息
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await Smartrequest(`${API_BASE}/auth/profile`);
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserProfile;
    } else {
      throw new Error(response.data.error || "获取用户信息失败");
    }
  },

  /**
   * 更新用户信息
   */
  updateProfile: async (data: {
    nickname?: string;
    avatar_url?: string;
  }): Promise<User> => {
    const response = await Smartrequest(`${API_BASE}/auth/profile`, {
      method: "PUT",
      data,
    });
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as User;
    } else {
      throw new Error(response.data.error || "更新用户信息失败");
    }
  },

  /**
   * 添加游戏账号
   */
  addGameAccount: async (data: {
    uid: string;
    nickname?: string;
    level?: number;
    world_level?: number;
    is_primary?: boolean;
  }): Promise<UserGameAccount> => {
    const response = await Smartrequest(`${API_BASE}/auth/game-account`, {
      method: "POST",
      data,
    });
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserGameAccount;
    } else {
      throw new Error(response.data.error || "添加游戏账号失败");
    }
  },

  /**
   * 设置主要游戏账号
   */
  setPrimaryAccount: async (uid: string): Promise<void> => {
    const response = await Smartrequest(
      `${API_BASE}/auth/game-account/${uid}/primary`,
      {
        method: "PUT",
      }
    );
    if (response.statusCode !== 200 || !response.data.success) {
      throw new Error(response.data.error || "设置主要账号失败");
    }
  },

  /**
   * 获取用户设置
   */
  getSettings: async (): Promise<UserSettings> => {
    const response = await Smartrequest(`${API_BASE}/auth/settings`);
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserSettings;
    } else {
      throw new Error(response.data.error || "获取设置失败");
    }
  },

  /**
   * 更新用户设置
   */
  updateSettings: async (
    settings: Partial<UserSettings>
  ): Promise<UserSettings> => {
    const response = await Smartrequest(`${API_BASE}/auth/settings`, {
      method: "PUT",
      data: settings,
    });
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserSettings;
    } else {
      throw new Error(response.data.error || "更新设置失败");
    }
  },
};

/**
 * 用户数据管理相关API
 */
export const userDataAPI = {
  /**
   * 获取用户角色数据
   */
  getCharacters: async (uid?: string): Promise<UserCharacterData[]> => {
    const url = uid
      ? `${API_BASE}/user/characters?uid=${uid}`
      : `${API_BASE}/user/characters`;
    const response = await Smartrequest(url);
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserCharacterData[];
    } else {
      throw new Error(response.data.error || "获取角色数据失败");
    }
  },

  /**
   * 同步角色数据
   */
  syncCharacters: async (data: SyncRequest): Promise<SyncResponse> => {
    const response = await Smartrequest(`${API_BASE}/user/sync`, {
      method: "POST",
      data,
    });
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as SyncResponse;
    } else {
      throw new Error(response.data.error || "同步角色数据失败");
    }
  },

  /**
   * 获取同步历史
   */
  getSyncLogs: async (limit: number = 20): Promise<SyncLog[]> => {
    const response = await Smartrequest(
      `${API_BASE}/user/sync-logs?limit=${limit}`
    );
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as SyncLog[];
    } else {
      throw new Error(response.data.error || "获取同步历史失败");
    }
  },

  /**
   * 切换角色收藏状态
   */
  toggleCharacterFavorite: async (
    uid: string,
    characterId: string,
    is_favorite: boolean
  ): Promise<void> => {
    const response = await Smartrequest(
      `${API_BASE}/user/characters/${uid}/${characterId}/favorite`,
      {
        method: "PUT",
        data: { is_favorite },
      }
    );
    if (response.statusCode !== 200 || !response.data.success) {
      throw new Error(response.data.error || "更新收藏状态失败");
    }
  },

  /**
   * 删除角色数据
   */
  deleteCharacter: async (uid: string, characterId: string): Promise<void> => {
    const response = await Smartrequest(
      `${API_BASE}/user/characters/${uid}/${characterId}`,
      {
        method: "DELETE",
      }
    );
    if (response.statusCode !== 200 || !response.data.success) {
      throw new Error(response.data.error || "删除角色数据失败");
    }
  },

  /**
   * 获取用户统计信息
   */
  getStats: async (): Promise<UserStats> => {
    const response = await Smartrequest(`${API_BASE}/user/stats`);
    if (response.statusCode === 200 && response.data.success) {
      return response.data.data as UserStats;
    } else {
      throw new Error(response.data.error || "获取统计信息失败");
    }
  },
};

/**
 * 通用的错误处理函数
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "网络请求失败，请检查网络";
};

/**
 * 用户相关的工具函数
 */
export const userUtils = {
  /**
   * 检查存储是否可用
   */
  isStorageAvailable: (): boolean => {
    try {
      return (
        typeof Taro !== "undefined" &&
        typeof Taro.getStorageSync === "function" &&
        typeof Taro.setStorageSync === "function"
      );
    } catch (error) {
      return false;
    }
  },

  /**
   * 检查是否已登录
   */
  isLoggedIn: (): boolean => {
    try {
      if (!userUtils.isStorageAvailable()) {
        console.warn("存储不可用，返回未登录状态");
        return false;
      }
      const userInfo = Taro.getStorageSync("userInfo");
      return !!userInfo && !!userInfo.openid;
    } catch (error) {
      console.error("检查登录状态失败:", error);
      return false;
    }
  },

  /**
   * 获取本地存储的用户信息
   */
  getStoredUserInfo: (): User | null => {
    try {
      if (!userUtils.isStorageAvailable()) {
        console.warn("存储不可用，无法获取用户信息");
        return null;
      }
      return Taro.getStorageSync("userInfo") || null;
    } catch (error) {
      console.error("获取本地用户信息失败:", error);
      return null;
    }
  },

  /**
   * 保存用户信息到本地存储
   */
  saveUserInfo: (userInfo: User): void => {
    try {
      if (!userUtils.isStorageAvailable()) {
        console.warn("存储不可用，无法保存用户信息");
        return;
      }
      Taro.setStorageSync("userInfo", userInfo);
    } catch (error) {
      console.error("保存用户信息失败:", error);
    }
  },

  /**
   * 清除本地存储的用户信息
   */
  clearUserInfo: (): void => {
    try {
      if (!userUtils.isStorageAvailable()) {
        console.warn("存储不可用，无法清除用户信息");
        return;
      }
      Taro.removeStorageSync("userInfo");
      Taro.removeStorageSync("userProfile");
      Taro.removeStorageSync("userSettings");
    } catch (error) {
      console.error("清除用户信息失败:", error);
    }
  },

  /**
   * 格式化同步时间
   */
  formatSyncTime: (timeString?: string): string => {
    if (!timeString) return "未同步";

    try {
      const date = new Date(timeString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 30) return `${days}天前`;

      return date.toLocaleDateString("zh-CN");
    } catch (error) {
      return "时间解析错误";
    }
  },

  /**
   * 验证UID格式
   */
  validateUID: (uid: string): boolean => {
    return /^[0-9]{9}$/.test(uid.trim());
  },

  /**
   * 获取主要游戏账号
   */
  getPrimaryGameAccount: (
    accounts: UserGameAccount[]
  ): UserGameAccount | null => {
    const primary = accounts.find(
      (account) => account.is_primary && account.is_active
    );
    return primary || (accounts.length > 0 ? accounts[0] : null);
  },
};
