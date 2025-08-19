import { PlayerInfo } from "../types/APIinfo";

/**
 * 获取模拟玩家数据
 */
export const getMockPlayerInfo = (uid: string): PlayerInfo => {
  return {
    uid: uid,
    nickname: "开拓者",
    level: 60,
    world_level: 8,
    friend_count: 45,
    avatar: {
      id: "8001",
      name: "星",
      icon: "https://example.com/avatar.png",
    },
    signature: "愿此行，终抵群星。",
    is_display: true,
    space_info: {
      memory_data: {
        level: 12,
        chaos_id: 2,
        chaos_level: 10,
        chaos_star_count: 36,
      },
      universe_level: 8,
      avatar_count: 28,
      light_cone_count: 15,
      relic_count: 180,
      achievement_count: 520,
      book_count: 85,
      music_count: 42,
    },
  };
};
