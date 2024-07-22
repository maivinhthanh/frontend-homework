import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from '@/redux/slices/invoiceSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'inovice',
  storage,
};
const invoicePersistedReducer = persistReducer(persistConfig, invoiceReducer);

const store = configureStore({
  reducer: {
    invoice: invoicePersistedReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type ReduxState = ReturnType<typeof store.getState>;

export default store;
