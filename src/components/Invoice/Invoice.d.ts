export interface InvoiceProps {
  values: Invoice;
  touched: FormikTouched<Invoice>;
  errors: FormikErrors;
  values: Invoice;
  touched: FormikTouched;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Invoice>>;
  isEdit: boolean;
  submitComponent: ReactNode;
}
