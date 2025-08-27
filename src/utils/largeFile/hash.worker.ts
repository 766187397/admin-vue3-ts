// 计算文件的 hash 值的 Web Worker
self.onmessage = async (e: MessageEvent<File>) => {
  const file = e.data;
  const buf = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  self.postMessage({ hash: hashHex });
};
