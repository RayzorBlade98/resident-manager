import React from 'react';
import InitializationButton from './InitializationButton/InitializationButton';
import InitializationForm from './InitializationForm/InitializationForm';

function InitializationView(): JSX.Element {
  return (
    <>
      <InitializationForm />
      <InitializationButton />
    </>
  );
}

export default InitializationView;
