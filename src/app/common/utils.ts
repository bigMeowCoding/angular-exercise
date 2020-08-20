export function parseSizeAttr(value: string): number {
  if (!value) {
    return 0;
  }
  return parseInt(value, 10);
}
