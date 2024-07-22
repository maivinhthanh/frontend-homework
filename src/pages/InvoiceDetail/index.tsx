import { Formik, FormikProps, Form, Field } from 'formik';
import 'dayjs/locale/vi';
import { Invoice as InvoiceType, InvoiceStatus } from '@/types';
import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editInvoice } from '@/redux/slices/invoiceSlice';
import { useNavigate, useParams } from 'react-router-dom';
import routeStrings from '@/routes/routeStrings';
import { useSnackbar } from '@/components/snackbar/Snackbar';
import Invoice from '@/components/Invoice';
import invoiceSchema, { initialValues } from '../CreateInvoice/invoiceSchema';
import { ReduxState } from '@/redux/store';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from '@mui/material';

const InvoiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const formikRef = useRef<FormikProps<InvoiceType>>(null);
  const { list } = useSelector((state: ReduxState) => state.invoice);
  const data = useMemo(() => list.find((e) => e.id === id) || initialValues, [list]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useState<InvoiceStatus>(data.status);

  const cancelCreateInvoice = () => {
    navigate(routeStrings.invoices);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleChangeStatus = (e: SelectChangeEvent<any>) => {
    const { value } = e.target;
    setStatus(value);
  };

  const handleSaveStatus = () => {
    formikRef.current?.setFieldValue('status', status);
    formikRef.current?.handleSubmit();
    handleClose();
  };

  const submitComponent = useMemo(() => {
    return (
      <>
        <Button onClick={() => setOpenModal(true)} variant="contained" color="primary">
          Update Status
        </Button>
        <Button onClick={cancelCreateInvoice} variant="outlined" color="error">
          Cancel
        </Button>
      </>
    );
  }, []);

  const handleSubmit = (values: InvoiceType) => {
    dispatch(editInvoice(values));
    showMessage('Save invoice success');
    navigate(routeStrings.invoices);
  };

  return (
    <>
      <Formik initialValues={data} validationSchema={invoiceSchema} innerRef={formikRef} onSubmit={handleSubmit}>
        {({ values, touched, errors, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Invoice
              values={values}
              touched={touched}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              isEdit={true}
              submitComponent={submitComponent}
            />
          </Form>
        )}
      </Formik>
      <Dialog onClose={handleClose} open={openModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update status</DialogTitle>
        <DialogContent>
          <FormControl variant="filled" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={status} onChange={handleChangeStatus}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Outstanding">Outstanding</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSaveStatus} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoiceDetail;
