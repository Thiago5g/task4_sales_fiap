export const calculateStopValue = (
  asset: string,
  entryPrice: number,
  stop: number,
  type: string,
  quantityContracts: number,
): number | null => {
  let pointValue: number;

  if (asset.includes('WIN')) {
    pointValue = 0.2;
  } else if (asset.includes('WDO')) {
    pointValue = 10;
  } else {
    return null;
  }

  const priceDifference =
    type === 'buy' ? entryPrice - stop : stop - entryPrice;

  const result = priceDifference * pointValue * quantityContracts;

  return parseFloat(result.toFixed(2));
};
