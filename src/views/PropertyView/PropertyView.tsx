import React from 'react';
import View from '../../routes';
import PropertyInformation from './PropertyInformation/PropertyInformation';
import AppBar from '_/components/shared/AppBar/AppBar';

function PropertyView() {
  return (
    <>
      <AppBar returnRoute={View.Main} />
      <PropertyInformation />
    </>
  );
}

export default PropertyView;
