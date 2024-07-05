export function groupBy<T>(arr: T[], fn: (item: T) => string | undefined) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    if (!groupKey) return prev;
    const group = prev[groupKey] ?? [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}
