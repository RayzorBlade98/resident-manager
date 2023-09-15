import React from 'react';
import { useRecoilValue } from 'recoil';
import waterCostsState from '_/states/waterCosts/waterCosts.state';

function WaterCostInformation(): JSX.Element {
  const waterCosts = useRecoilValue(waterCostsState);
  return (
    <>
      <p>{`Wasserkosten ${waterCosts.waterUsageCosts[0].costPerCubicMeter}`}</p>
      <p>{`Abwasserkosten ${waterCosts.sewageCosts[0].costPerCubicMeter}`}</p>
    </>
  );
}

export default WaterCostInformation;
