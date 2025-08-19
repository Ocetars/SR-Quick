// 微信小程序全局类型定义
declare global {
  interface Wx {
    getStorageSync: (key: string) => any;
    setStorageSync: (key: string, value: any) => void;
    removeStorageSync: (key: string) => void;
  }

  const wx: Wx;
}

export {};
