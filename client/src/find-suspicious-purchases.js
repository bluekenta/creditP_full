/**
 * Detect purchases that are out of the ordinary for each customer's own history.
 * A purchase is suspicious if its amount is a statistical outlier for that customer:
 * amount > mean + (STANDARD_DEVIATIONS * std) for that customer's purchases.
 * Customers with only one purchase have no baseline, so they are not flagged.
 */
const STANDARD_DEVIATIONS = 2;
const MIN_PURCHASES_FOR_BASELINE = 2;

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

function standardDeviation(arr) {
  if (arr.length < 2) return 0;
  const m2 = mean(arr);
  const variance = arr.reduce((s, x) => s + (x - m2) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

/**
 * @param {Array<{ customerId: string, amount: number, [category]: string, [id]: string }>} purchases
 * @returns {Array} Purchases that are outliers for their customer's history
 */
const findSuspiciousPurchases = (purchases) => {
  if (!purchases?.length) return [];

  const byCustomer = new Map();
  for (const p of purchases) {
    const cid = p.customerId;
    if (!byCustomer.has(cid)) byCustomer.set(cid, []);
    byCustomer.get(cid).push(p);
  }

  const suspicious = [];
  for (const [customerId, list] of byCustomer) {
    if (list.length < MIN_PURCHASES_FOR_BASELINE) continue;
    const amounts = list.map((p) => p.amount);
    const m = mean(amounts);
    const std = standardDeviation(amounts);
    if (std === 0) continue;
    const threshold = m + STANDARD_DEVIATIONS * std;
    for (const p of list) {
      if (p.amount > threshold) suspicious.push(p);
    }
  }
  return suspicious;
};

export default findSuspiciousPurchases;
