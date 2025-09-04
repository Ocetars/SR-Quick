import { View, Text, Input, Button, Image } from "@tarojs/components";
import type { PlayerInfo } from "@/types/mihomo";
import refreshIcon from "@/assets/refresh.png";
import changeIcon from "@/assets/change.png";
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
  onUidClick: () => void;
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
  onUidClick,
}: TopSectionProps) {
  // 计算昵称显示宽度：中文字母算2，英文字母算1
  const calculateDisplayWidth = (str: string): number => {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(char)) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  };
  const nicknameStr = player?.nickname || "未知用户";
  const displayWidth = calculateDisplayWidth(nicknameStr);
  const shouldShowLevel = displayWidth <= 8; // 阈值

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
              <Text className="nickname">{nicknameStr}</Text>
              {shouldShowLevel ? (
                <Text className="level">Lv.{player?.level || "未知"}</Text>
              ) : null}
            </View>
            <Text className="uid">UID: {player?.uid || mainUid}</Text>
          </View>

          <View className="uidChangeSection" onClick={onUidClick}>
            <Image src={changeIcon} style={{ width: 20, height: 20 }} />
          </View>
          <View style={{ flex: 1 }} />
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
