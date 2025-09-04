import { Smartrequest } from "./request";
import type {
  ApiWrapper,
  UserTypeData,
  BindUserResponseData,
  PlayerSummaryResponse,
  RefreshPlayerResponse,
} from "@/types/api";

/**
 * 用户与 UID 相关 API
 */

/**
 * 查询当前用户类型与绑定信息
 */
export const getUserType = async () => {
  const data = await Smartrequest<ApiWrapper<UserTypeData>>(
    "/api/v1/user/type",
    {
      method: "GET",
    }
  );
  return data.data;
};

/**
 * 绑定 UID 到当前用户并自动同步
 */
export const bindUserUid = async (payload: { uid: string }) => {
  const data = await Smartrequest<ApiWrapper<BindUserResponseData>>(
    "/api/v1/user/bind",
    {
      method: "POST",
      data: payload,
    }
  );
  return data.data;
};

/**
 * 更新 UID 信息并自动同步（返回最新数据）
 */
export const refreshPlayerByUid = async (uid: string) => {
  const data = await Smartrequest<RefreshPlayerResponse>(
    `/api/v1/player/${uid}`,
    {
      method: "GET",
    }
  );
  return data;
};

/**
 * 获取首页 summary
 */
export const getPlayerSummary = async (uid: string) => {
  const data = await Smartrequest<PlayerSummaryResponse>(
    `/api/v1/player/${uid}/summary`,
    {
      method: "GET",
    }
  );
  return data;
};

/**
 * 获取具体角色面板
 */
export const getCharacterDetail = async (params: {
  uid: string;
  characterId: string;
}) => {
  const { uid, characterId } = params;
  const data = await Smartrequest<import("@/types/mihomo").CharacterInfo>(
    `/api/v1/player/${uid}/characters/${characterId}`,
    { method: "GET" }
  );
  return data;
};
