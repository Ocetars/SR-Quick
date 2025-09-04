export type NormalizedError = Error & {
  kind?: "fail" | "error";
  code?: string | number;
  details?: any;
  httpStatus?: number;
  raw?: any;
};

export function toUserMessage(err: unknown): string {
  const e = err as NormalizedError | undefined;
  if (!e) return "未知错误";

  if (e.kind === "fail") {
    if ((e as any)?.raw?.code === "MISSING_OPENID" || e.httpStatus === 401) {
      return "未登录或环境异常，请在小程序内打开后重试";
    }
    const msg = (e as any)?.raw?.error || e.message;
    return msg || "请求不合法，请检查输入";
  }

  if (e.kind === "error") {
    return e.message || "服务器开小差了，请稍后再试";
  }

  const message = (e as any)?.message;
  return message || "发生了一些问题，请稍后再试";
}

export function isUnauthorized(err: unknown): boolean {
  const e = err as NormalizedError | undefined;
  return (
    !!e && (e.httpStatus === 401 || (e as any)?.raw?.code === "MISSING_OPENID")
  );
}
