import React from 'react';
import { useRecoilValue } from 'recoil';
import propertyState from '_/states/property/property.state';

function GeneralPropertyInformation() {
  const property = useRecoilValue(propertyState);

  return (
    <>
      <p>
        {property.address.street}
        {' '}
        {property.address.houseNumber}
      </p>
      <p>
        {property.address.zipCode}
        {' '}
        {property.address.city}
      </p>
    </>
  );
}

export default GeneralPropertyInformation;
