export function makeArr(len) {
  return Array.from(new Array(len)).map((item, index) => {
    return index;
  });
}
