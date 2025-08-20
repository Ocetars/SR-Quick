import { Smartrequest } from "./request";

/**
 * 用户与 UID 相关 API
 */

/**
 * 查询当前用户类型与绑定信息
 */
export const getUserType = () => {
  return Smartrequest("/api/v1/user/type", { method: "GET" });
};

/**
 * 绑定 UID 到当前用户并自动同步
 */
export const bindUserUid = (payload: { uid: string }) => {
  return Smartrequest("/api/v1/user/bind", { method: "POST", data: payload });
};

/**
 * 更新 UID 信息并自动同步（返回最新数据）
 */
export const refreshPlayerByUid = (uid: string) => {
  return Smartrequest(`/api/v1/player/${uid}`, { method: "GET" });
};

/**
 * 获取首页 summary
 */
export const getPlayerSummary = (uid: string) => {
  return Smartrequest(`/api/v1/player/${uid}/summary`, { method: "GET" });
};

/**
 * 获取具体角色面板
 */
export const getCharacterDetail = (params: {
  uid: string;
  characterId: string;
}) => {
  const { uid, characterId } = params;
  return Smartrequest(`/api/v1/player/${uid}/characters/${characterId}`, {
    method: "GET",
  });
};
