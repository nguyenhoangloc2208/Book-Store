import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng Local Storage
import { combineReducers } from 'redux';
import ProductSlice from './slice/ProductSlice';

const persistConfig = {
  key: 'root', // Khóa cho Local Storage
  storage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  products: ProductSlice,
}));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // middleware: [],
});

const persistor = persistStore(store);

export { store, persistor };