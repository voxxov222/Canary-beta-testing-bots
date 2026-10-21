export type DiffLine = { type: "same" | "add" | "del"; text: string };

export function diffLines(before: string, after: string): DiffLine[] {
  const A = before.replace(/\n$/, "").split("\n");
  const B = after.replace(/\n$/, "").split("\n");
  const n = A.length;
  const m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = A[i] === B[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      out.push({ type: "same", text: A[i]! });
      i += 1;
      j += 1;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push({ type: "del", text: A[i]! });
      i += 1;
    } else {
      out.push({ type: "add", text: B[j]! });
      j += 1;
    }
  }
  while (i < n) out.push({ type: "del", text: A[i++]! });
  while (j < m) out.push({ type: "add", text: B[j++]! });
  return out;
}
