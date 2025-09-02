import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.css";
import {
  getUserType,
  bindUserUid,
  getPlayerSummary,
  refreshPlayerByUid,
} from "@/api/user";
import { useEffect, useState, useCallback } from "react";
import type { PlayerInfo } from "@/types/mihomo";
import type {
  UserTypeData,
  PlayerSummaryResponse,
  CharacterSummary,
  UserBoundItem,
} from "@/types/api";
import TopSection from "./components/TopSection";
import CharacterSection from "./components/CharacterSection";
import UidManagerPanel from "@/components/UidManagerPanel";

import background from "@/assets/bg1.jpg";

type UserTypeResponse = UserTypeData;

export default function MainPage() {
  const [loading, setLoading] = useState(false);
  const [needBind, setNeedBind] = useState(true);
  const [mainUid, setMainUid] = useState("");
  const [uidInput, setUidInput] = useState("");
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [uidPanelVisible, setUidPanelVisible] = useState(false);
  const [boundUids, setBoundUids] = useState<UserBoundItem[]>([]);
  const [newUidInput, setNewUidInput] = useState("");

  const fetchUserAndMaybeSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getUserType()) as UserTypeResponse;
      const isNew = !!data.is_new;
      const hasBound = !!data.has_bound;
      if (isNew || (!isNew && !hasBound)) {
        setNeedBind(true);
        setMainUid("");
        setPlayer(null);
        setCharacters([]);
        setBoundUids([]);
      } else if (hasBound && data.main_uid) {
        setNeedBind(false);
        setMainUid(data.main_uid);
        setBoundUids(data.uids || []);
        await fetchSummary(data.main_uid);
        Taro.showToast({ title: "已获取数据", icon: "success" });
      } else {
        setNeedBind(true);
      }
    } catch (e) {
      Taro.showToast({ title: "加载失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (uid: string) => {
    if (!uid) return;
    try {
      setLoading(true);
      const data = (await getPlayerSummary(uid)) as PlayerSummaryResponse;
      if (data) {
        setPlayer(data.player);
        setCharacters(data.characters || []);
      }
    } catch (e) {
      Taro.showToast({ title: "获取首页数据失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  }, []);

  const onBind = useCallback(async () => {
    const uid = uidInput.trim();
    if (!uid) {
      Taro.showToast({ title: "请输入 UID", icon: "none" });
      return;
    }
    try {
      setLoading(true);
      Taro.showLoading({ title: "绑定中" });
      await bindUserUid({ uid });
      setNeedBind(false);
      setMainUid(uid);
      await fetchSummary(uid);
      Taro.showToast({ title: "绑定成功", icon: "success" });
    } catch (e) {
      Taro.showToast({ title: "绑定失败，请重试", icon: "none" });
    } finally {
      setLoading(false);
      Taro.hideLoading();
    }
  }, [uidInput, fetchSummary]);

  const onRefreshLatest = useCallback(async () => {
    if (!mainUid) return;
    try {
      setLoading(true);
      Taro.showLoading({ title: "同步中" });
      // 使用刷新 UID 的接口以同步最新数据
      await refreshPlayerByUid(mainUid);
      await fetchSummary(mainUid);
      Taro.showToast({ title: "已更新", icon: "success" });
    } catch (e) {
      Taro.showToast({ title: "更新失败", icon: "none" });
    } finally {
      setLoading(false);
      Taro.hideLoading();
    }
  }, [mainUid, fetchSummary]);

  const openUidPanel = useCallback(() => {
    setUidPanelVisible(true);
    setNewUidInput("");
  }, []);

  const closeUidPanel = useCallback(() => {
    setUidPanelVisible(false);
  }, []);

  const onSelectUid = useCallback(
    async (uid: string) => {
      if (!uid || uid === mainUid) {
        setUidPanelVisible(false);
        return;
      }
      try {
        setLoading(true);
        Taro.showLoading({ title: "切换中" });
        await refreshPlayerByUid(uid);
        setMainUid(uid);
        await fetchSummary(uid);
        Taro.showToast({ title: "已切换", icon: "success" });
      } catch (e) {
        Taro.showToast({ title: "切换失败", icon: "none" });
      } finally {
        setLoading(false);
        Taro.hideLoading();
        setUidPanelVisible(false);
      }
    },
    [mainUid, fetchSummary]
  );

  const onBindNewUid = useCallback(async () => {
    const uid = newUidInput.trim();
    if (!uid) {
      Taro.showToast({ title: "请输入 UID", icon: "none" });
      return;
    }
    try {
      setLoading(true);
      Taro.showLoading({ title: "绑定中" });
      const res = await bindUserUid({ uid });
      setMainUid(uid);
      await fetchSummary(uid);
      const latest = (await getUserType()) as UserTypeResponse;
      setBoundUids(latest.uids || []);
      setNeedBind(false);
      Taro.showToast({ title: "绑定成功", icon: "success" });
    } catch (e) {
      Taro.showToast({ title: "绑定失败，请重试", icon: "none" });
    } finally {
      setLoading(false);
      Taro.hideLoading();
      setUidPanelVisible(false);
    }
  }, [newUidInput, fetchSummary]);

  const onEnterDetail = useCallback(
    (characterId: string) => {
      if (!mainUid) return;
      Taro.navigateTo({
        url: `/pages/characterDetail/index?uid=${mainUid}&characterId=${characterId}`,
      });
    },
    [mainUid]
  );

  useEffect(() => {
    fetchUserAndMaybeSummary();
  }, [fetchUserAndMaybeSummary]);

  return (
    <View className="page">
      <Image className="background" src={background} mode="aspectFill" />
      <View className="content">
        <TopSection
          needBind={needBind}
          player={player}
          mainUid={mainUid}
          uidInput={uidInput}
          loading={loading}
          onUidInputChange={setUidInput}
          onBind={onBind}
          onRefreshLatest={onRefreshLatest}
          onUidClick={openUidPanel}
        />

        <CharacterSection
          needBind={needBind}
          characters={characters}
          onEnterDetail={onEnterDetail}
        />

        <UidManagerPanel
          visible={uidPanelVisible}
          loading={loading}
          mainUid={mainUid}
          boundUids={boundUids}
          newUidInput={newUidInput}
          onChangeNewUid={setNewUidInput}
          onSelectUid={onSelectUid}
          onBindNewUid={onBindNewUid}
          onClose={closeUidPanel}
        />
      </View>
    </View>
  );
}
