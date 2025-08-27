import { View, Text, Input, Button, Image } from "@tarojs/components";
import type { PlayerInfo } from "@/types/mihomo";
import refreshIcon from "@/assets/refresh.png";
import "./TopSection.css";
import ResolvedImage from "@/utils/ResolvedImage";

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
        <View className="playerCard">
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
        <View className="playerCard">
          <View className="avatarContainer">
            {player?.avatar?.icon ? (
              <ResolvedImage
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
            <View className="nameLevel">
              <Text className="nickname">{player?.nickname || "未知用户"}</Text>
              <Text className="level">Lv. {player?.level || "未知"}</Text>
            </View>
            <Text className="uid">UID: {player?.uid || mainUid}</Text>
          </View>
          <Button
            className="btnRefresh"
            disabled={loading}
            onClick={onRefreshLatest}
          >
            <Image
              src={refreshIcon}
              className="icon-refresh"
              style={{ width: 24, height: 24 }}
            />
          </Button>
        </View>
      )}
    </View>
  );
}
