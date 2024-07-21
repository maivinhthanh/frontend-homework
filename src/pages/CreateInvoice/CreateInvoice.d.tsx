import { Invoice } from '@/types';
import { FormikErrors, FormikTouched } from 'formik';

export interface InvoiceInformationProps {
  values: Invoice;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Invoice>>;
  errors: FormikErrors<Invoice>;
  touched: FormikTouched<Invoice>
}
