import ErrorIcon from '@mui/icons-material/Error';
import {
  Box, Tab, TabOwnProps, Tabs,
} from '@mui/material';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider', marginBottom: '20px' },
};

/**
 * Object containing configuration for a single form group
 */
interface GroupConfig {
  /**
   * Label of the form group tab
   */
  label: string;

  /**
   * Icon of the form group tab
   */
  icon?: {
    /**
     * Component of the icon
     */
    component: Exclude<TabOwnProps['icon'], undefined>;

    /**
     * Position of the icon
     */
    iconPosition?: TabOwnProps['iconPosition'];
  };
}

type GroupContainers<TGroups extends string> = Record<
TGroups,
(props: { children: React.ReactNode }) => React.JSX.Element
>;

/**
 * Props of the GroupedForm component
 */
export interface GroupedFormProps<
  TInput extends object,
  TGroups extends string,
> {
  /**
   * Form errors returned by the form validation
   */
  formErrors: ReturnType<typeof useFormValidation<TInput>>['formErrors'];

  /**
   * Mapping of the form inputs to their form groups
   */
  groupMappings: Record<keyof TInput, TGroups>;

  /**
   * Configuration for each form group
   */
  groupConfigs: Record<TGroups, GroupConfig>;

  /**
   * Form group that is active by default
   */
  defaultGroup: TGroups;

  children: (groupedForm: {
    /**
     * Container components for each form group
     */
    containers: GroupContainers<TGroups>;
  }) => React.ReactNode;
}

/**
 * Component that provides functionality to group a form in different tabs
 */
function GroupedForm<TInput extends object, TGroups extends string>(
  props: GroupedFormProps<TInput, TGroups>,
) {
  const groupsArray = useMemo(
    () => Object.keys(props.groupConfigs) as TGroups[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [activeTabIndex, setActiveTabIndex] = useState(
    groupsArray.indexOf(props.defaultGroup),
  );

  const groupErrors = useMemo(
    () => _<[keyof TInput, TGroups]>(
      Object.entries(props.groupMappings) as [keyof TInput, TGroups][],
    )
      .groupBy(([, group]) => group)
      .mapValues((grouped) => grouped.map(([field, __]) => props.formErrors[field]))
      .mapValues((errors) => errors.some((error) => error !== undefined))
      .value() as Record<TGroups, boolean>,
    [props.groupMappings, props.formErrors],
  );

  const containers = useMemo(
    () => Object.fromEntries(
      groupsArray.map((group) => [
        group,
        ({ children }: { children: React.ReactNode }) => (
          <div key={`container-${group}`} hidden={group !== groupsArray[activeTabIndex]}>{children}</div>
        ),
      ]),
    ) as GroupContainers<TGroups>,
    [groupsArray, activeTabIndex],
  );

  return (
    <>
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTabIndex}
          onChange={(__, tab: number) => setActiveTabIndex(tab)}
        >
          {groupsArray.map((group) => (
            <Tab
              icon={
                groupErrors[group] ? (
                  <ErrorIcon color="error" />
                ) : (
                  props.groupConfigs[group].icon?.component
                )
              }
              iconPosition={
                props.groupConfigs[group].icon?.iconPosition ?? 'start'
              }
              label={props.groupConfigs[group].label}
              key={`tab-${group}`}
            />
          ))}
        </Tabs>
      </Box>
      {props.children({ containers })}
    </>
  );
}

export default GroupedForm;
