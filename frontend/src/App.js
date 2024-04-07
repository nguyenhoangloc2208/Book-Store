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
import images from './assets/images/image';

// Third party
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ScrollToTopButton from './utils/ScrollToTopButton';
import ScrollToTop from './utils/ScrollToTop';
import Loading from './components/ui/Loading';
import Cookies from "js-cookie";

import { Toaster } from 'react-hot-toast';


const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

function App() {
  const {data: productsData, error: productsError, isLoading: productsLoading} = useSWR('/api/products/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const {data: categoriesData, error: categoriesError, isLoading: categoriesLoading} = useSWR('/api/products/categories/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const {data: authorsData, error: authorsError, isLoading: authorsLoading} = useSWR('/api/products/authors', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
  const dispatch = useDispatch();

  const isLoggedInStr = Cookies.get('isLoggedIn');
  if(!isLoggedInStr) {
      Cookies.set('isLoggedIn', false.toString());
      // Xử lý khi chưa đăng nhập
  }
  
  useEffect(() => {
    if(productsData && categoriesData && authorsData){
      dispatch(setProductsFromRedux(productsData));
      dispatch(setCategoriesFromRedux(categoriesData));
      dispatch(setAuthorsFromRedux(authorsData));
      Cookies.set('blogs')
    }
  }, [productsData, categoriesData, authorsData, dispatch]);

  
  if (productsError || categoriesError || authorsError) return <div>failed to load</div>
  if (productsLoading || categoriesLoading || authorsLoading) return <div><Loading/></div>
  return (
    <>
    <PayPalScriptProvider options={{clientId: "AZnHMZthBRZSkFK03p6XrOBrMxCUVUUuDlJbjJ-TShQ2SeXkQrW7BhfONP6aSIH3OgK1KwGj0vNNEE2n"}}>
      <div className='App'>
        <ScrollToTop/>
        <Header/>
        <Navbar/>
        <div className='site-content'>
          <AppRouter/>
        </div>
        <Footer/>
        <ScrollToTopButton/>
        <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 3000,
          style: {
            background: '#FFF0D3',
            color: '#010101',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      </div>
    </PayPalScriptProvider>
    </>
  );
}

export default App;
