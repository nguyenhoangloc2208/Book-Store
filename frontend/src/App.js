import './App.scss';
import AppRouter from './routes/AppRoutes';
import Header from './layouts/Header/Header';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';
import useSWR from 'swr';
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import api from './services/api';
import { useDispatch } from 'react-redux';
import { setCategoriesFromRedux, setProductsFromRedux, setAuthorsFromRedux } from './store/slice/ProductSlice';
import React, { useEffect } from 'react';

const fetcher = (url) => api.get(url).then(res => res.results)

function App() {
  const {data: products, error: errorProduct, isLoading: isLoadingProduct} = useSWR('/api/products/', fetcher, {refreshInterval: 120000});
  const {data: categories, error: errorCategory, isLoading: isLoadingCategory} = useSWR('/api/products/categories/', fetcher, {refreshInterval: 120000});
  const {data: authors, error: errorAuthor, isLoading: isLoadingAuthor} = useSWR('/api/products/authors/', fetcher, {refreshInterval: 120000});
  const dispatch = useDispatch();

  
  useEffect(() => {
    if(products && products.length > 0){
      dispatch(setProductsFromRedux(products));
    }
    if(categories && categories.length > 0){
      dispatch(setCategoriesFromRedux(categories));
    }
    if(authors && authors.length > 0){
      dispatch(setAuthorsFromRedux(authors));
    }
  }, [products, categories, authors, dispatch]);
  
  // if (errorProduct && errorCategory && errorAuthor) return <div>failed to load</div>
  if (isLoadingProduct && isLoadingCategory && isLoadingAuthor) return <div>loading...</div>
  return (
    <>
    {/* <PayPalScriptProvider options={{clientId: "AZnHMZthBRZSkFK03p6XrOBrMxCUVUUuDlJbjJ-TShQ2SeXkQrW7BhfONP6aSIH3OgK1KwGj0vNNEE2n"}}> */}
      <div className='App'>
        <Header/>
        <Navbar/>
        <div className='site-content'>
          <AppRouter/>
        </div>
        <Footer/>
      </div>
    {/* </PayPalScriptProvider> */}
    </>
  );
}

export default App;
