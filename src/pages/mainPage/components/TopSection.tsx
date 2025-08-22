import { View, Text, Input, Button, Image } from "@tarojs/components";
import type { PlayerInfo } from "@/types/mihomo";

interface TopSectionProps {
  needBind: boolean;
  player: PlayerInfo | null;
  mainUid: string;
  uidInput: string;
  loading: boolean;
  onUidInputChange: (value: string) => void;
  onBind: () => void;
  onRefreshLatest: () => void;
}

export default function TopSection({
  needBind,
  player,
  mainUid,
  uidInput,
  loading,
  onUidInputChange,
  onBind,
  onRefreshLatest,
}: TopSectionProps) {
  return (
    <View className="top">
      {needBind ? (
        <View className="playerCard cardContent">
          <Text className="cardTitle">绑定 UID</Text>
          <View className="bindForm">
            <Input
              className="inputField"
              placeholder="请输入 UID"
              value={uidInput}
              onInput={(e) => onUidInputChange((e.detail as any).value)}
              maxlength={12}
              type="number"
            />
            <Button className="btnPrimary" disabled={loading} onClick={onBind}>
              绑定
            </Button>
          </View>
        </View>
      ) : (
        <View className="playerCard cardContent">
          <View className="avatarContainer">
            {player?.avatar?.icon ? (
              <Image
                className="avatar"
                src={player.avatar.icon}
                mode="aspectFill"
              />
            ) : (
              <View className="avatarPlaceholder">
                <Text className="avatarPlaceholderText">头像</Text>
              </View>
            )}
          </View>
          <View className="infoSection">
            <Text className="nickname">{player?.nickname || "未知用户"}</Text>
            <Text className="uid">UID: {player?.uid || mainUid}</Text>
            <Text className="level">等级 {player?.level || "未知"}</Text>
          </View>
          <Button
            className="btnRefresh"
            disabled={loading}
            onClick={onRefreshLatest}
          >
            刷新数据
          </Button>
        </View>
      )}
    </View>
  );
}
