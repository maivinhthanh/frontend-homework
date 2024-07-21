import { Dayjs } from "dayjs";

export type InvoiceStatus = 'Pending' | 'Paid' | 'Cancelled' | 'Outstanding' | 'Late';

export type Product = {
  name: string;
  quantity: number;
  rate: string;
  price: number;
  amount: number;
}

export type Invoice = {
  id: string;
  type: string;
  prepared: string;
  contractor: string;
  vat: string;
  bankAccount: string;
  invoiceDate: Dayjs;
  dueDate: Dayjs;
  payment: 'cash' | 'card';
  products: Product[];
  status: InvoiceStatus;
  createDate: Dayjs;
  category: 'inprogess' | 'draft';
};

export interface FilterInvoice {
  startDate?: Dayjs | string | null;
  endDate?: Dayjs | string | null;
  status?: string;
  contractor?: string;
  category?: string;
  vat?: string;
  page?: string;
  pageSize?: string;
}