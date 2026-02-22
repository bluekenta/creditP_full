const findSuspiciousPurchases = (purchases) => {
  return purchases.filter((purchase) => purchase.amount > 500);
};

export default findSuspiciousPurchases;
