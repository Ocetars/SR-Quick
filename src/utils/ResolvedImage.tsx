import { Image, ImageProps, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { getImageSource, type ImageLoadStrategy } from "@/utils/imageSource";

type Props = Omit<ImageProps, "src"> & {
  src?: string;
  strategy?: ImageLoadStrategy; // "cloudId" | "tempUrl"
};

export default function ResolvedImage(props: Props) {
  const { src: raw, strategy = "cloudId", ...rest } = props;
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [used, setUsed] = useState<ImageLoadStrategy>("cloudId");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const { src: out, used } = await getImageSource(raw, strategy);
      if (mounted) {
        setSrc(out);
        setUsed(used);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [raw, strategy]);

  if (loading) {
    return (
      <View
        style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }}
      />
    );
  }

  return <Image src={src} {...rest} />;
}
