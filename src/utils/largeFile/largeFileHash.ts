/**
 * 计算大文件的 SHA256 值
 * @param file 文件
 * @returns hash 值
 */
export async function calcSHA256(file: File): Promise<string> {
  const worker = new Worker(new URL("./hash.worker.ts", import.meta.url), {
    type: "module",
  });
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.hash) {
        worker.terminate();
        resolve(e.data.hash);
      }
    };
    worker.onerror = reject;
    worker.postMessage(file);
  });
}
