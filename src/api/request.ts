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
  let resp: any;
  try {
    if (USE_LOCAL_API) {
      console.log(`🔧 使用本地API: ${LOCAL_API_BASE_URL}${path}`);
      resp = await localRequest<any>(path, options);
    } else {
      console.log(`☁️ 使用云托管API: ${path}`);
      resp = await cloudRequest<any>(path, options);
    }
  } catch {
    throw new Error("网络异常，请检查网络后重试");
  }

  const statusCode = (resp && (resp.statusCode ?? resp.status)) as
    | number
    | undefined;
  let body: any = resp?.data;

  if (typeof body === "string") {
    try {
      body = body ? JSON.parse(body) : {};
    } catch {
      throw new Error("服务返回异常，请稍后重试");
    }
  }

  switch (body?.status) {
    case "success":
      return body.data as T;
    case "fail": {
      const info = body?.data;
      const msg = info?.error || "请求不合法，请检查输入";
      const err: any = new Error(msg);
      err.kind = "fail";
      err.details = info?.details;
      err.raw = info;
      err.httpStatus = statusCode;
      return Promise.reject(err);
    }
    case "error": {
      const errBody = body;
      const msg = errBody?.message || "服务器开小差了，请稍后再试";
      const err: any = new Error(msg);
      err.kind = "error";
      err.code = errBody?.code;
      err.raw = errBody?.data;
      err.httpStatus = statusCode;
      return Promise.reject(err);
    }
    default:
      return Promise.reject(new Error("非预期返回格式，请稍后再试"));
  }
};
