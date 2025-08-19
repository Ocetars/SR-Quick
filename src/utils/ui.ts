import Taro from "@tarojs/taro";

/**
 * 显示加载提示
 */
export const showLoading = (title = "加载中...") => {
  Taro.showLoading({
    title,
    mask: true,
  });
};

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  Taro.hideLoading();
};

/**
 * 显示错误提示
 */
export const showError = (message: string) => {
  Taro.showToast({
    title: message,
    icon: "error",
    duration: 2000,
  });
};

/**
 * 显示成功提示
 */
export const showSuccess = (message: string) => {
  Taro.showToast({
    title: message,
    icon: "success",
    duration: 2000,
  });
};
