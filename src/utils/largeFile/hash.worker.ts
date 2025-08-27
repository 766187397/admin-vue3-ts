// 计算文件的 hash 值的 Web Worker
import SparkMD5 from "spark-md5";

self.onmessage = async (e: MessageEvent<File>) => {
  const file = e.data;
  const chunkSize = 2 * 1024 * 1024; // 2 MB
  const chunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const buf = await file.slice(start, end).arrayBuffer();
    spark.append(buf);
    self.postMessage({ percent: Math.round(((i + 1) / chunks) * 100) });
  }
  const hash = spark.end();
  self.postMessage({ hash });
};
