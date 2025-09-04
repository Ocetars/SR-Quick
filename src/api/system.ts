import { Smartrequest } from "./request";
import type { HealthResponse, DebugIpResponse } from "@/types/api";

/**
 * 系统调试相关 API
 */

/**
 * 健康检查
 */
export const getHealth = async () => {
  const data = await Smartrequest<HealthResponse>("/health", { method: "GET" });
  return data;
};

/**
 * 调试IP信息
 */
export const getDebugIp = async () => {
  const data = await Smartrequest<DebugIpResponse>("/debug/ip", {
    method: "GET",
  });
  return data;
};
