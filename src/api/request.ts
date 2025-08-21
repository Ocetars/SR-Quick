import Taro from "@tarojs/taro";

// API 基础配置
export const API_TIMEOUT = 10000;

// 获取 env 配置
const USE_LOCAL_API = process.env.TARO_APP_USE_LOCAL_API === "true";
console.log("USE_LOCAL_API:", process.env.TARO_APP_USE_LOCAL_API);

const LOCAL_API_BASE_URL = process.env.TARO_APP_API_BASE_URL;

/**
 * 本地API请求封装
 */
export const localRequest = async <T = any>(
  path: string,
  options?: { method?: "GET" | "POST" | "PUT" | "DELETE"; data?: any }
) => {
  const url = `${LOCAL_API_BASE_URL}${path}`;
  const { method = "GET", data } = options || {};

  return await Taro.request<T>({
    url,
    method,
    data,
    header: {
      "Content-Type": "application/json",
      "X-Frontend-Env": process.env.TARO_APP_ENV,
      "X-Frontend-API-Mode": "local",
      "X-Frontend-API-URL": LOCAL_API_BASE_URL,
    },
    timeout: API_TIMEOUT,
  });
};

/**
 * 云托管请求封装
 */
export const cloudRequest = async <T = any>(
  path: string,
  options?: { method?: "GET" | "POST" | "PUT" | "DELETE"; data?: any }
) => {
  const { method = "GET", data } = options || {};
  const CLOUD_CONFIG = {
    env: process.env.TARO_APP_CLOUD_ENV,
    serviceName: process.env.TARO_APP_CLOUD_SERVICE,
  };
  return await Taro.cloud.callContainer<T>({
    path,
    method: method as any, // 解决类型兼容问题
    data,
    header: {
      "X-WX-SERVICE": CLOUD_CONFIG.serviceName,
      "Content-Type": "application/json",
      "X-Frontend-Env": process.env.TARO_APP_ENV,
      "X-Frontend-API-Mode": "cloud",
      "X-Frontend-Cloud-Env": CLOUD_CONFIG.env,
    },
    timeout: API_TIMEOUT,
  });
};

/**
 * 统一请求封装 - 根据环境自动选择本地或云托管API
 */
export const Smartrequest = async <T = any>(
  path: string,
  options?: { method?: "GET" | "POST" | "PUT" | "DELETE"; data?: any }
) => {
  if (USE_LOCAL_API) {
    console.log(`🔧 使用本地API: ${LOCAL_API_BASE_URL}${path}`);
    return await localRequest<T>(path, options);
  } else {
    console.log(`☁️ 使用云托管API: ${path}`);
    return await cloudRequest<T>(path, options);
  }
};
