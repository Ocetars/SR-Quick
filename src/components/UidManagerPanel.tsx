import { View, Text, Input, Button, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { UserBoundItem } from "@/types/api";

interface UidManagerPanelProps {
  visible: boolean;
  loading: boolean;
  mainUid: string;
  boundUids: UserBoundItem[];
  newUidInput: string;
  onChangeNewUid: (value: string) => void;
  onSelectUid: (uid: string) => void;
  onBindNewUid: () => void;
  onClose: () => void;
}

const styles = {
  mask: {
    position: "fixed" as const,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  panel: {
    width: "90%",
    maxWidth: "80vw",
    maxHeight: "90vh",
    minHeight: "50vh",
    background: "#ffffff",
    borderRadius: 24,
    overflow: "hidden" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 10px 20px 0px",
    // marginBottom: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#1d1d1f",
    letterSpacing: 1.2,
    lineHeight: 1.4,
    paddingLeft: 22,
    paddingTop: 20,
  },
  close: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 20,
    background: "#f5f5f7",
    color: "#86868b",
    fontSize: 11,
  },
  bindSection: {
    padding: "0 20px",
    marginBottom: 10,
  },
  bindForm: {
    // marginTop: 20,
    display: "flex",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: 1.2,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderStyle: "solid" as const,
    borderColor: "#f5f5f7",
    padding: "7px 15px",
    borderRadius: 16,
    background: "#fbfbfd",
    fontSize: 14,
    fontWeight: 300,
    color: "#1d1d1f",
    letterSpacing: 1.2,
  },
  bindBtn: {
    borderRadius: 16,
    background: "linear-gradient(135deg, #007aff 0%, #5856d6 100%)",
    color: "#ffffff",
    // padding: "18px 32px",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 1.2,
  },
  listSection: {
    // borderTopWidth: 2,
    // borderTopStyle: "solid" as const,
    // borderTopColor: "rgba(0,0,0,0.1)",
    paddingTop: 14,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: "#1d1d1f",
    padding: "20px 22px 12px 22px",
    letterSpacing: 1.4,
  },
  list: {
    maxHeight: 320,
    paddingBottom: 28,
    paddingTop: 5,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "10px 22px",
    position: "relative" as const,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid" as const,
  },
  itemActiveBar: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    background: "linear-gradient(135deg, #007aff 0%, #5856d6 100%)",
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "row" as const,
    gap: 8,
  },
  itemUid: {
    fontSize: 16,
    fontWeight: 400,
    color: "#1d1d1f",
    letterSpacing: 1.2,
  },
  itemName: {
    fontSize: 16,
    color: "#86868b",
    fontWeight: 400,
    letterSpacing: 1.2,
  },
  empty: {
    padding: "56px 22px",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 28,
    background: "#f5f5f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    color: "#86868b",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#86868b",
    fontWeight: 400,
    letterSpacing: 1.2,
  },
  emptyHint: {
    fontSize: 14,
    color: "#c7c7cc",
    fontWeight: 300,
    marginTop: 6,
    letterSpacing: 1.2,
  },
} as const;

export default function UidManagerPanel(props: UidManagerPanelProps) {
  const {
    visible,
    loading,
    mainUid,
    boundUids,
    newUidInput,
    onChangeNewUid,
    onSelectUid,
    onBindNewUid,
    onClose,
  } = props;

  if (!visible) return null;

  return (
    <View style={styles.mask} onClick={onClose}>
      <View style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <View style={styles.header}>
          <Text style={styles.title}>查询新的UID</Text>
          <View style={styles.close} onClick={onClose}>
            ✕
          </View>
        </View>

        <View style={styles.bindSection}>
          <View style={styles.bindForm}>
            <Input
              style={styles.input}
              placeholder="请输入 9 位数字 UID"
              value={newUidInput}
              onInput={(e) => onChangeNewUid(e.detail.value)}
              maxlength={12}
              type="number"
            />
            <Button
              style={styles.bindBtn}
              disabled={loading || !newUidInput.trim()}
              onClick={onBindNewUid}
            >
              查询
            </Button>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>历史查询</Text>
          <ScrollView scrollY style={styles.list}>
            {boundUids && boundUids.length > 0 ? (
              boundUids.map((item) => (
                <View
                  key={item.uid}
                  style={styles.item}
                  onClick={() => onSelectUid(item.uid)}
                >
                  {item.uid === mainUid && (
                    <View style={styles.itemActiveBar} />
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemUid}>{item.uid}</Text>
                    <Text style={styles.itemName}>
                      {item.nickname || "未知用户"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>📝</View>
                <Text style={styles.emptyText}>暂无已绑定的 UID</Text>
                <Text style={styles.emptyHint}>
                  在上方输入框中绑定第一个 UID
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
