import { fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React, { useEffect } from 'react';
import ContractResidentDisplay from './ContractResidentDisplay';
import * as createContractResidentModalModule from '_/components/shared/CreateContractResidentModal/CreateContractResidentModal';
import { ContractResident } from '_/models/resident/contractResident';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';

describe('ContractResidentDisplay', () => {
  const contractResidents = range(3).map((i) => new ContractResidentBuilder()
    .withName(new NameBuilder().withFirstName(`Max ${i}`).build())
    .build());
  const newContractResident = new ContractResidentBuilder()
    .withPhone('666')
    .build();
  const errorMessage = 'Error';
  const onSubmitContractResidentMock = jest.fn();

  function CreateContractResidentModalMock(props: {
    show: boolean;
    onClose: () => void;
    onSubmit: (resident: ContractResident) => void;
  }) {
    useEffect(() => {
      if (props.show) {
        props.onSubmit(newContractResident);
        props.onClose();
      }
    }, [props]);

    return props.show ? <p>CreateContractResidentModalMock</p> : null;
  }

  function renderComponent(showResidents: boolean, showError: boolean) {
    return render(
      <ReactTestWrapper>
        <ContractResidentDisplay
          contractResidents={showResidents ? contractResidents : undefined}
          error={showError ? errorMessage : undefined}
          onSubmitContractResident={onSubmitContractResidentMock}
        />
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    jest.resetAllMocks();

    jest
      .spyOn(createContractResidentModalModule, 'default')
      .mockImplementation(CreateContractResidentModalMock);
  });

  test('should match image snapshot (no error)', async () => {
    // Arrange
    renderComponent(true, false);

    // Assert
    expect(
      await generateImage({ viewport: { width: 600, height: 100 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (error)', async () => {
    // Arrange
    renderComponent(false, true);

    // Assert
    expect(
      await generateImage({ viewport: { width: 150, height: 100 } }),
    ).toMatchImageSnapshot();
  });

  test('should submit created contract resident', () => {
    // Arrange
    const { baseElement } = renderComponent(false, false);

    // Act
    fireEvent.click(
      baseElement.querySelector("[data-testid='AddCircleOutlineIcon']")!,
    );

    // Assert
    expect(onSubmitContractResidentMock).toHaveBeenCalledTimes(1);
    expect(onSubmitContractResidentMock).toHaveBeenLastCalledWith(
      newContractResident,
    );
  });
});
