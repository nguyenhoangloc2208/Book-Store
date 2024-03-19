import './App.scss';
import AppRouter from './routes/AppRoutes';
import Header from './layouts/Header/Header';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';
import useSWR from 'swr';
import api from './services/api';
import { useDispatch } from 'react-redux';
import { setCategoriesFromRedux, setProductsFromRedux, setAuthorsFromRedux } from './store/slice/ProductSlice';
import React, { useEffect } from 'react';

// Third party
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

function App() {
  const {data: productsData, error: productsError, isLoading: productsLoading} = useSWR('/api/products/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const {data: categoriesData, error: categoriesError, isLoading: categoriesLoading} = useSWR('/api/products/categories/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const {data: authorsData, error: authorsError, isLoading: authorsLoading} = useSWR('/api/products/authors', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(productsData && categoriesData && authorsData){
      dispatch(setProductsFromRedux(productsData));
      dispatch(setCategoriesFromRedux(categoriesData));
      dispatch(setAuthorsFromRedux(authorsData));
    }
  }, [productsData, categoriesData, authorsData, dispatch]);

  
  if (productsError || categoriesError || authorsError) return <div>failed to load</div>
  if (productsLoading || categoriesLoading || authorsLoading) return <div>loading...</div>
  return (
    <>
    <PayPalScriptProvider options={{clientId: "AZnHMZthBRZSkFK03p6XrOBrMxCUVUUuDlJbjJ-TShQ2SeXkQrW7BhfONP6aSIH3OgK1KwGj0vNNEE2n"}}>
      <div className='App'>
        <Header/>
        <Navbar/>
        <div className='site-content'>
          <AppRouter/>
        </div>
        <Footer/>
      </div>
    </PayPalScriptProvider>
    </>
  );
}

export default App;
