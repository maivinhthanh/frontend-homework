import { Invoice } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface IInvoiceState {
  list: Invoice[];
  draftList: Invoice[];
}

const initialState: IInvoiceState = {
  list: [],
  draftList: [],
};

const invoiceSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addInvoice: (state, action: { payload: Invoice }) => {
      state.list = [...state.list, action.payload];
    },
  },
});

export const { addInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
