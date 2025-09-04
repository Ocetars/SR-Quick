import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useCallback, useState } from "react";
import { getCharacterDetail } from "@/api/user";
import { toUserMessage } from "@/utils/apiError";
import type { CharacterInfo } from "@/types/mihomo";

export default function CharacterDetailPage() {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<CharacterInfo | null>(null);

  const fetchDetail = useCallback(async (uid: string, characterId: string) => {
    try {
      setLoading(true);
      const data = await getCharacterDetail({ uid, characterId });
      if (data) setDetail(data);
    } catch (e) {
      const msg = toUserMessage(e);
      Taro.showToast({ title: msg || "加载失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  }, []);

  useLoad((query) => {
    const uid = (query?.uid as string) || "";
    const characterId = (query?.characterId as string) || "";
    if (!uid || !characterId) {
      Taro.showToast({ title: "参数缺失", icon: "none" });
      return;
    }
    fetchDetail(uid, characterId);
  });

  return (
    <ScrollView scrollY style={{ height: "100vh" }}>
      {!detail ? (
        <View style={{ padding: 16 }}>
          <Text>{loading ? "加载中..." : "暂无数据"}</Text>
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          <View style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src={detail.icon}
              mode="aspectFill"
              style={{ width: 72, height: 72, borderRadius: 8 }}
            />
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {detail.name}
              </Text>
              <View>
                <Text>等级：{detail.level}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text>路径：{detail.path?.name || "-"}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text>元素：{detail.element?.name || "-"}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text>行迹数：{detail.skill_trees?.length || 0}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text>遗器数：{detail.relics?.length || 0}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text>属性数：{detail.attributes?.length || 0}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
