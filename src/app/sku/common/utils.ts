// 获得对象的key
export function getObjKeys(obj) {
  if (obj !== Object(obj)) {
    throw new TypeError('Invalid object');
  }
  const keys = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys[keys.length] = key;
    }
  }
  return keys;
}
