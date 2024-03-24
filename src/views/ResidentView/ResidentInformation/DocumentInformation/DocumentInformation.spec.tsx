import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import residentViewState from '../../states/resident_view_state';
import DocumentInformation from './DocumentInformation';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';

describe('DocumentInformation', () => {
  const resident = new ResidentBuilder().build();
  const landlord = new LandlordBuilder().build();
  const property = new PropertyBuilder().build();

  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper
        initializationFunction={() => {
          setRecoil(residentState, [resident]);
          setRecoil(residentViewState, (state) => ({
            ...state,
            selectedResident: resident.id,
          }));
          setRecoil(propertyState, property);
          setRecoil(landlordState, landlord);
        }}
      >
        <DocumentInformation />
      </ReactTestWrapper>,
    );
  });

  test('should generate contract', () => {
    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(mockedIpcAPIFunctions.generateContractPdf).toHaveBeenCalledTimes(1);
    expect(mockedIpcAPIFunctions.generateContractPdf).toHaveBeenLastCalledWith({
      resident,
      landlord,
      property,
    });
  });
});
