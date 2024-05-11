import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import GroupedForm, { GroupedFormProps } from './GroupedForm';

type FormInput = {
  group1Input1: string;
  group1Input2: string;
  group2Input1: string;
  group2Input2: string;
  group3Input1: string;
  group3Input2: string;
};

type FormGroups = 'group1' | 'group2' | 'group3';

const groupConfig: Omit<
GroupedFormProps<FormInput, FormGroups>,
'formErrors' | 'children'
> = {
  defaultGroup: 'group2',
  groupMappings: {
    group1Input1: 'group1',
    group1Input2: 'group1',
    group2Input1: 'group2',
    group2Input2: 'group2',
    group3Input1: 'group3',
    group3Input2: 'group3',
  },
  groupConfigs: {
    group1: {
      label: 'Label Group 1',
      icon: {
        component: <div>Icon 1</div>,
        iconPosition: 'start',
      },
    },
    group2: {
      label: 'Label Group 2',
      icon: {
        component: <div>Icon 2</div>,
      },
    },
    group3: {
      label: 'Label Group 3',
      icon: {
        component: <div>Icon 3</div>,
        iconPosition: 'end',
      },
    },
  },
};

const groupsArray = Object.keys(groupConfig.groupConfigs) as FormGroups[];

describe('GroupedForm', () => {
  test('should display default group on start', () => {
    // Arrange
    const renderResult = renderForm();

    // Assert
    expectActiveContent(renderResult, 1);
  });

  test('should display the correct tab content', () => {
    // Arrange
    const renderResult = renderForm();
    const tabs = renderResult.getAllByRole('tab');

    tabs.forEach((tab, i) => {
      // Act
      fireEvent.click(tab);

      // Assert
      expectActiveContent(renderResult, i);
    });
  });

  test('should match image snapshot', async () => {
    // Act
    renderForm({ group1Input1: 'error' });

    // Assert
    expect(await generateImage()).toMatchImageSnapshot();
  });
});

function renderForm(
  formErrors?: GroupedFormProps<FormInput, FormGroups>['formErrors'],
) {
  return render(
    <GroupedForm<FormInput, FormGroups>
      {...groupConfig}
      formErrors={formErrors ?? {}}
    >
      {({ containers }) => groupsArray.map((group, i) => containers[group]({
        children: (
          <div data-testid="content">{`Content group ${i + 1}`}</div>
        ),
      }))}
    </GroupedForm>,
  );
}

function expectActiveContent(
  renderResult: RenderResult,
  activeTabIndex: number,
) {
  const contents = renderResult.getAllByTestId('content');
  expect(contents).toHaveLength(3);

  contents.forEach((content, i) => {
    expect(content.parentElement!.hidden).toBe(activeTabIndex !== i);
  });
}
