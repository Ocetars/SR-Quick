import { Smartrequest } from "./request";

/**
 * 系统调试相关 API
 */

/**
 * 健康检查
 */
export const getHealth = () => {
  return Smartrequest("/health", { method: "GET" });
};

/**
 * 调试IP信息
 */
export const getDebugIp = () => {
  return Smartrequest("/debug/ip", { method: "GET" });
};
