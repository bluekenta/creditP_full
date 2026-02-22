/**
 * O(n) single-pass: group by (customerId, category), then filter by count.
 * Previously O(n²) nested loops caused severe slowness with large datasets.
 */
const findFrequentBuyers = (purchases, category, minimumPurchaseCount = 1) => {
  const key = (customerId, cat) => `${customerId}\0${cat}`;
  const map = new Map(); // key -> { customerId, count, totalAmount }

  for (let i = 0; i < purchases.length; i++) {
    const p = purchases[i];
    if (p.category !== category) continue;
    const k = key(p.customerId, p.category);
    const cur = map.get(k);
    if (cur) {
      cur.count += 1;
      cur.totalAmount += p.amount;
    } else {
      map.set(k, {
        customerId: p.customerId,
        count: 1,
        totalAmount: p.amount,
      });
    }
  }

  return [...map.values()].filter((r) => r.count >= minimumPurchaseCount);
};

export default findFrequentBuyers;
