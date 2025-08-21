import type { PlayerInfo, CharacterInfo } from "./mihomo";

// 通用包装：部分接口为 { code, data }
export interface ApiWrapper<T> {
  code: number;
  data: T;
}

// GET /api/v1/user/type
export interface UserBoundItem {
  uid: string;
  nickname: string;
  last_sync_at: string | null;
}

export interface UserTypeData {
  is_new: boolean;
  has_bound: boolean;
  main_uid: string;
  uids: UserBoundItem[];
}

// POST /api/v1/user/bind
export interface BindUserResponseData {
  createdBinding: boolean;
  alreadyBound: boolean;
  mainUidSet: boolean;
  uid: string;
}

// GET /api/v1/player/{uid}/summary（精简角色列表）
export interface CharacterSummary {
  id: string;
  icon: string;
  name: string;
  rank: number;
  level: number;
  rarity: number;
  preview: string;
  portrait: string;
  promotion: number;
}

export interface PlayerSummaryResponse {
  player: PlayerInfo;
  characters: CharacterSummary[];
}

// GET /api/v1/player/{uid}
export type RefreshPlayerResponse = {
  player: PlayerInfo;
  characters: CharacterInfo[];
};

// 系统类
export interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
}

export interface DebugIpResponse {
  ip: string;
  ips: string[];
  remoteAddress: string;
  trustProxy: number;
}
