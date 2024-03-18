import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../components/NotFound";
import Login from "../pages/Login/Login";
import Cart from "../pages/Cart/Cart";
import Register from "../pages/Register/Register";
import Pages from "../pages/Pages/Pages";
import Collections from "../pages/Collections/Collections";
import CategoryDetail from "../pages/Collections/CategoryDetail";
import ProductDetail from "../pages/Collections/ProductDetail";
import Profile from "../pages/Profile/Profile";
// import Payment from "../components/Payment";


const AppRouter = () =>{
    return(
        <>
            <Routes basename='/'>
                <Route path='/' element={<Home />} exact/>
                <Route path='/collections/' element={<Collections />} />
                <Route path='/collections/all' element={<Collections />} />
                <Route path='/collections/:slug' element={<CategoryDetail />} />
                <Route path='/products/:slug' element={<ProductDetail />} />
                <Route path='/account/login' element={<Login />} />
                <Route path='/account/register' element={<Register />} />
                <Route path='/account' element={<Profile/>}/>
                <Route path='/pages/:url' element={<Pages/>}/>
                <Route path='/cart' element={<Cart/>}/>
                {/* <Route path='/account/payment/paypal' element={<Payment/>}/> */}
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}

export default AppRouter;