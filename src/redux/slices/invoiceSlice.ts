import { Invoice } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IInvoiceState {
  list: Invoice[];
}

const initialState: IInvoiceState = {
  list: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.list.push(action.payload);
    },
    editInvoice: (state, action: PayloadAction<Invoice>) => {
      const indexInvoice = state.list.findIndex((e) => e.id === action.payload.id);
      if (indexInvoice !== -1) {
        state.list[indexInvoice] = action.payload;
      }
    },
  },
});

export const { addInvoice, editInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
