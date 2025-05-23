/**
 * 递归深拷贝（常见类型）
 * @template T 要克隆的值的类型
 * @param {T} value 要克隆的值
 * @returns {T} 克隆后的新数据
 */
export function deepClone<T>(value: T): T {
  if (value === null || value === undefined || typeof value !== "object") {
    return value as T;
  }

  if (value instanceof Date) {
    return new Date(value) as unknown as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value) as unknown as T;
  }

  const newValue: T = Array.isArray(value) ? ([] as unknown as T) : Object.create(Object.getPrototypeOf(value));

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      (newValue as any)[key] = deepClone((value as any)[key]);
    }
  }

  return newValue;
}

/**
 * 递归深拷贝（包含循环引用对象等）
 * @template T 要克隆的值的类型
 * @param {T} value 要克隆的值
 * @param {WeakMap<object, any>} hash 用于处理循环引用的WeakMap
 * @returns {T} 克隆后的新数据
 */
export function deepCloneOverall<T>(value: T, hash: WeakMap<object, any> = new WeakMap()): T {
  if (value === null || value === undefined) {
    return value as T;
  }

  // 检查是否已经是克隆过的对象
  if (hash.has(value as object)) {
    return hash.get(value as object) as T;
  }

  // 处理原始类型和非对象类型
  if (typeof value !== "object") {
    return value as T;
  }

  // 处理 Date 和 RegExp
  if (value instanceof Date) {
    return new Date(value) as unknown as T;
  }
  if (value instanceof RegExp) {
    return new RegExp(value) as unknown as T;
  }

  // 处理 Map
  if (value instanceof Map) {
    const mapCopy = new Map();
    value.forEach((itemValue, key) => {
      mapCopy.set(key, deepCloneOverall(itemValue, hash));
    });
    return mapCopy as unknown as T;
  }

  // 处理 Set
  if (value instanceof Set) {
    const setCopy = new Set();
    value.forEach((itemValue) => {
      setCopy.add(deepCloneOverall(itemValue, hash));
    });
    return setCopy as unknown as T;
  }

  // 如果是函数，返回原函数
  if (typeof value === "function") {
    return value as T;
  }

  // 创建新对象/数组
  const newValue = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));

  // 添加到哈希表以防止循环引用
  hash.set(value as object, newValue);

  // 获取所有自身属性，包括不可枚举的
  const descriptors = Object.getOwnPropertyDescriptors(value);

  // 遍历描述符并深拷贝每个属性
  Object.keys(descriptors).forEach((key) => {
    if (descriptors[key].get || descriptors[key].set) {
      // 如果是访问器属性，直接复制描述符
      Object.defineProperty(newValue, key, descriptors[key]);
    } else {
      // 否则，递归地深拷贝属性值
      (newValue as any)[key] = deepCloneOverall((value as any)[key], hash);
    }
  });

  // 处理 symbol 键
  const symbolKeys = Object.getOwnPropertySymbols(value);
  for (const sym of symbolKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(value, sym);
    if (descriptor && !descriptor.get && !descriptor.set) {
      (newValue as any)[sym] = deepCloneOverall((value as any)[sym], hash);
    } else if (descriptor) {
      Object.defineProperty(newValue, sym, descriptor);
    }
  }

  return newValue as unknown as T;
}
