import React from 'react';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';

/**
 * Component that displays general information about the property
 */
function GeneralPropertyInformation() {
  const { property } = usePropertyState();

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
