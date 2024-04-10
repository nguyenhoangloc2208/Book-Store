import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../components/NotFound";
import Login from "../pages/Login/Login";
import Cart from "../pages/Cart/Cart";
import Register from "../pages/Register/Register";
// import Page from "../pages/Pages/Pages";
import Collections from "../pages/Collections/Collections";
import CategoryDetail from "../pages/Collections/CategoryDetail";
import ProductDetail from "../pages/Collections/ProductDetail";
import Profile from "../pages/Profile/Profile";
import Checkout from "../pages/Cart/Checkout";
// import Payment from "../components/Payment";
import { REACT_APP_STRIPE_KEY } from "../config/config";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js/pure"
import CardSwiper from "../components/ui/AutoPlaySlider";
import Loading from "../components/ui/Loading";
import PaymentSuccess from "../components/ui/Success";
import Author from "../pages/Collections/Author";
import AllProduct from "../pages/Collections/AllProduct";
import SearchResult from "../pages/Search/SearchResult";
import VerificationEmail from "../pages/Register/VerificationEmail";
import ConfirmEmail from "../pages/Register/ConfirmEmail";
import Post from "../pages/Pages/Post";
import BlogRelease from "../pages/Blogs/BlogRelease";
import BlogReleaseDetail from "../pages/Blogs/BlogReleaseDetail";
import BlogReviewDetail from "../pages/Blogs/BlogReviewDetail";
import BlogReview from "../pages/Blogs/BlogReviews";
import ForgotPassWord from "../components/Account/ForgotPassword";
const stripe_key = REACT_APP_STRIPE_KEY
const stripePromise = loadStripe(stripe_key)


const createDynamicPage = (Component, baseUrl) => {
    return () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || '1';
        const path = page === '1' ? baseUrl : `${baseUrl}?page=${page}`;
        return <Component currentPage={page} path={path} />;
    }
}

const AllProductPage = createDynamicPage(AllProduct, '/collections/all');
const CategoryDetailPage = createDynamicPage(CategoryDetail, '/collections/:slug');
const AuthorPage = createDynamicPage(Author, '/collections/author/:slug');
const BlogReleasePage = createDynamicPage(BlogRelease, `/blogs/tong-hop-tin-phat-hanh`);
const BlogReviewPage = createDynamicPage(BlogReview, `/blogs/reviews`);


const AppRouter = () =>{
    return(
        <>
        <Elements stripe={stripePromise} >
            <Routes basename='/'>
                <Route path='/' element={<Home />} exact/>
                <Route path='/collections/' element={<Collections />} />
                <Route path='/collections/all' element={<AllProductPage/>} />                
                <Route path='/collections/:slug' element={<CategoryDetailPage />} />
                <Route path='/collections/author/:slug' element={<AuthorPage />} />
                <Route path='/products/:slug' element={<ProductDetail />} />
                <Route path='/account/login' element={<Login />} />
                <Route path='/account/forgot-password' element={<ForgotPassWord />} />
                <Route path='/account/change-password' element={<Login />} />
                <Route path='/account/register' element={<Register />} />
                <Route path='/account/register/verification/:email' element={<VerificationEmail />} />
                <Route path='/account' element={<Profile/>}/>
                <Route path='/pages/:slug' element={<Post/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/checkouts/:buyer' element={<Checkout/>}/>
                {/* <Route path='/account/payment/paypal' element={<Payment/>}/> */}
                <Route path='*' element={<NotFound />} />
                <Route path='/test' element={<CardSwiper />} />
                <Route path='/loading' element={<Loading />} />
                <Route path='/payment/success' element={<PaymentSuccess />} />
                <Route path='/payment/cancel' element={<PaymentSuccess />} />
                <Route path='/search' element={<SearchResult />} />
                <Route path='/account/email/confirm/:key/' element={<ConfirmEmail />} />
                <Route path='/blogs/tong-hop-tin-phat-hanh' element={<BlogReleasePage />} />
                <Route path='/blogs/reviews' element={<BlogReviewPage />} />
                <Route path='/blogs/tong-hop-tin-phat-hanh/:slug' element={<BlogReleaseDetail />} />
                <Route path='/blogs/reviews/:slug' element={<BlogReviewDetail />} />
            </Routes>
        </Elements>
        </>
    )
}


export default AppRouter;