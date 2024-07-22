import { Formik, FormikProps, Form } from 'formik';
import invoiceSchema, { initialValues } from './invoiceSchema'; // Adjust the import path as needed
import 'dayjs/locale/vi';
import { Invoice as InvoiceType } from '@/types';
import { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addInvoice } from '@/redux/slices/invoiceSlice';
import { useNavigate } from 'react-router-dom';
import routeStrings from '@/routes/routeStrings';
import { useSnackbar } from '@/components/snackbar/Snackbar';
import Invoice from '@/components/Invoice';
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const formikRef = useRef<FormikProps<InvoiceType>>(null);
  const [isSaveDraft, setIsSaveDraft] = useState<boolean>(false);

  const initialValue = useMemo(() => {
    initialValues.id = uuidv4();
    return initialValues
  }, []);

  const cancelCreateInvoice = () => {
    navigate(routeStrings.invoices);
  };

  const saveDraftInvoice = () => {
    setIsSaveDraft(true);
    formikRef?.current?.handleSubmit();
  };

  const submitComponent = useMemo(() => {
    return (
      <>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={saveDraftInvoice} variant="contained" color="secondary">
          Save as draft
        </Button>
        <Button onClick={cancelCreateInvoice} variant="outlined" color="error">
          Cancel
        </Button>
      </>
    );
  }, []);

  const handleSubmit = (values: InvoiceType) => {
    if (isSaveDraft) {
      values.category = 'draft';
    }
    dispatch(addInvoice(values));
    showMessage('Save invoice success');
    navigate(routeStrings.invoices);
  };

  return (
    <Formik initialValues={initialValue} validationSchema={invoiceSchema} innerRef={formikRef} onSubmit={handleSubmit}>
      {({ values, touched, errors, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Invoice
            values={values}
            touched={touched}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            isEdit={false}
            submitComponent={submitComponent}
          />
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoice;
