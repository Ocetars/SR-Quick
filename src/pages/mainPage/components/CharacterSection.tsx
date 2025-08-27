import { View, Text, Image, ScrollView } from "@tarojs/components";
import type { CharacterSummary } from "@/types/api";
import "./CharacterSection.css";
import ResolvedImage from "@/utils/ResolvedImage";

interface CharacterSectionProps {
  needBind: boolean;
  characters: CharacterSummary[];
  onEnterDetail: (characterId: string) => void;
}

export default function CharacterSection({
  needBind,
  characters,
  onEnterDetail,
}: CharacterSectionProps) {
  return (
    <View className="bottom">
      <View className="sectionTitle">
        <Text>角色柜</Text>
      </View>
      {needBind ? (
        <View className="placeholder">
          <Text>绑定 UID 后展示角色柜</Text>
        </View>
      ) : (
        <ScrollView scrollY className="characterScroll">
          <View className="characterGrid">
            {characters?.map((c) => (
              <View
                key={c.id}
                className="characterCard"
                onClick={() => onEnterDetail(c.id)}
              >
                <ResolvedImage
                  className="characterAvatar"
                  src={c.icon}
                  mode="aspectFill"
                />
                <Text className="characterName">{c.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
