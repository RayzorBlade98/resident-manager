import React from 'react';
import PropertyInitializationButton from './PropertyInitializationButton/PropertyInitializationButton';
import PropertyInitializationForm from './PropertyInitializationForm/PropertyInitializationForm';

function PropertyInitializationView(): JSX.Element {
  return (
    <>
      <h1>Immobilieninformationen</h1>
      <PropertyInitializationForm />
      <PropertyInitializationButton />
    </>
  );
}

export default PropertyInitializationView;
