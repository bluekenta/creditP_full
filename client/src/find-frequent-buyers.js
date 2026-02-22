const findFrequentBuyers = (purchases, category, minimumPurchaseCount = 1) => {
  const frequentBuyers = [];

  for (let i = 0; i < purchases.length; i++) {
    const customerId = purchases[i].customerId;
    const productCategory = purchases[i].category;

    // Check if the product category matches and the customer has made multiple purchases
    if (productCategory === category) {
      let count = 0;
      let totalAmount = 0;

      for (let j = 0; j < purchases.length; j++) {
        if (purchases[j].customerId === customerId && purchases[j].category === category) {
          count++;
          totalAmount += purchases[j].amount;
        }
      }

      // Add the customer to frequentBuyers if they bought the product more than once
      if (count >= minimumPurchaseCount && !frequentBuyers.includes(customerId)) {
        frequentBuyers.push({
          customerId,
          count,
          totalAmount,
        });
      }
    }
  }

  return frequentBuyers;
};

export default findFrequentBuyers;
