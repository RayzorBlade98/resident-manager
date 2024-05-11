import { GroupedFormProps } from '_/components/form/GroupedForm/GroupedForm';
import { FormValidationArguments } from '_/hooks/useFormValidation/useFormValidation';

/**
 * Object containing the config of a grouped form
 */
export type FormConfig<TInput extends object, TGroups extends string> = {
  formValidationConfig: Omit<
  FormValidationArguments<TInput>,
  'onSubmitSuccess'
  >;
  formGroupConfig: Omit<
  GroupedFormProps<TInput, TGroups>,
  'children' | 'formErrors'
  >;
};
