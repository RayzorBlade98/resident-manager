import {
  LocalizationProvider,
  deDE as datepickerDE,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import React, { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StandardLocalizationProviderProps {}

function StandardLocalizationProvider(
  props: PropsWithChildren<StandardLocalizationProviderProps>,
): JSX.Element {
  // eslint-disable-next-line max-len
  const datePickerLocalization = datepickerDE.components.MuiLocalizationProvider.defaultProps.localeText;
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
      localeText={datePickerLocalization}
    >
      {props.children}
    </LocalizationProvider>
  );
}

export default StandardLocalizationProvider;
