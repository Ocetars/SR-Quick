import Taro from "@tarojs/taro";

export type ImageLoadStrategy = "cloudId" | "tempUrl";
// 内存缓存
const tempUrlCache = new Map<string, { url: string; expireAt: number }>();

// 生成 cloudID
const getCloudId = (path?: string): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || /^cloud:\/\//i.test(path)) return path;

  const assetBase = process.env.TARO_APP_ASSET_BASE;
  if (!assetBase) return "";

  const normalizedPath = path.replace(/^\/+/, "");

  return `cloud://${assetBase}/StarRailRes/${normalizedPath}`;
};

// 解析 cloudID 为临时URL（带缓存）
const getTempUrl = async (cloudId: string): Promise<string> => {
  if (!cloudId || !/^cloud:\/\//i.test(cloudId)) return cloudId;

  const cached = tempUrlCache.get(cloudId);
  if (cached && cached.expireAt > Date.now()) return cached.url;

  try {
    const res = await Taro.cloud.getTempFileURL({
      fileList: [cloudId],
    });

    const item = (res as any)?.fileList?.[0];
    const url: string = item?.tempFileURL || item?.downloadURL || "";
    const maxAge: number = item?.maxAge ?? 7200; // 默认2小时

    if (url) {
      tempUrlCache.set(cloudId, {
        url,
        expireAt: Date.now() + maxAge * 1000,
      });
      return url;
    }
  } catch (error) {
    console.warn("获取临时URL失败:", error);
  }

  return "";
};

// 根据策略返回最终可用于 <Image src> 的地址
export const getImageSource = async (
  raw?: string,
  strategy: ImageLoadStrategy = "cloudId"
): Promise<{ src: string; used: ImageLoadStrategy }> => {
  if (!raw) return { src: "", used: strategy };

  const cloudId = getCloudId(raw);
  if (!cloudId) return { src: "", used: strategy };

  switch (strategy) {
    case "cloudId":
      return { src: cloudId, used: "cloudId" };

    case "tempUrl":
      const tempUrl = await getTempUrl(cloudId);
      return {
        src: tempUrl || cloudId,
        used: tempUrl ? "tempUrl" : "cloudId",
      };
  }
};
