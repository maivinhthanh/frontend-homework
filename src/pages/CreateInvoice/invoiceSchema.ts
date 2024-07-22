import { Invoice, InvoiceStatus } from '@/types';
import * as Yup from 'yup';
import dayjs from 'dayjs';

const productSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  rate: Yup.string().required('Rate is required'),
  price: Yup.number().required('Price is required'),
  amount: Yup.number().required('Amount is required'),
});

const invoiceSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  type: Yup.string().required('Type is required'),
  prepared: Yup.string().required('Prepared by is required'),
  contractor: Yup.string().required('Contractor is required'),
  vat: Yup.string().required('vat is required'),
  bankAccount: Yup.string().required('Bank account is required'),
  invoiceDate: Yup.date().required('Invoice date is required'),
  dueDate: Yup.date().required('Due date is required').min(Yup.ref('invoiceDate'), 'Due date cannot be before invoice date'),
  payment: Yup.mixed().oneOf(['cash', 'card']).required('Payment method is required'),
  products: Yup.array().of(productSchema).required('Products are required'),
  status: Yup.mixed<InvoiceStatus>().oneOf(['Pending', 'Paid', 'Cancelled', 'Outstanding', 'Late']).required('Status is required'),
  createDate: Yup.date().required('Create date is required'),
});

export const initialValues: Invoice = {
  id: '',
  type: '',
  prepared: '',
  contractor: '',
  vat: '',
  bankAccount: '',
  invoiceDate: dayjs(),
  dueDate: dayjs(),
  payment: 'cash',
  products: [],
  status: 'Pending',
  createDate: dayjs(),
  category: 'inprogess',
};

export default invoiceSchema;

