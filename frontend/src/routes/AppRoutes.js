import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.js";
import NotFound from "../components/NotFound.js";
import Login from "../pages/Login/Login.js";
import Cart from "../pages/Cart/Cart.js";
import Register from "../pages/Register/Register.js";
import Collections from "../pages/Collections/Collections.js";
import CategoryDetail from "../pages/Collections/CategoryDetail.js";
import ProductDetail from "../pages/Collections/ProductDetail.js";
import Profile from "../pages/Profile/Profile.js";
import Checkout from "../pages/Cart/Checkout.js";
import { REACT_APP_STRIPE_KEY } from "../config/config.js";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js/pure.js"
import CardSwiper from "../components/ui/AutoPlaySlider.js";
import Loading from "../components/ui/Loading.js";
import PaymentSuccess from "../components/ui/Success.js";
import Author from "../pages/Collections/Author.js";
import AllProduct from "../pages/Collections/AllProduct.js";
import SearchResult from "../pages/Search/SearchResult.js";
import VerificationEmail from "../pages/Register/VerificationEmail.js";
import ConfirmEmail from "../pages/Register/ConfirmEmail.js";
import Post from "../pages/Pages/Post.js";
import BlogRelease from "../pages/Blogs/BlogRelease.js";
import BlogReleaseDetail from "../pages/Blogs/BlogReleaseDetail.js";
import BlogReviewDetail from "../pages/Blogs/BlogReviewDetail.js";
import BlogReview from "../pages/Blogs/BlogReviews.js";
import ForgotPassWord from "../components/Account/ForgotPassword.js";
import ResetPassword from "../components/Account/ResetPassword.js";
import ChangePassword from "../components/Account/ChangePassword.js";
const stripe_key = REACT_APP_STRIPE_KEY
const stripePromise = loadStripe(stripe_key)


const createDynamicPage = (Component, baseUrl) => {
    const DynamicPage = () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || '1';
        const inStock = params.get('in_stock');
        const outOfStock = params.get('out_of_stock');
        
        let queryParams = '';
        if (inStock === 'true') {
            queryParams += 'in_stock=true&';
        }
        if (outOfStock === 'true') {
            queryParams += 'out_of_stock=true&';
        }
        const path = page === '1' ? `${baseUrl}?${queryParams}` : `${baseUrl}?page=${page}&${queryParams}`;
        return <Component currentPage={page} path={path} />;
    }

    // Đặt tên hiển thị cho component DynamicPage
    DynamicPage.displayName = `DynamicPage(${Component.displayName || Component.name || 'Component'})`;

    return DynamicPage;
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
                <Route path='/account/change-password' element={<ChangePassword />} />
                <Route path='/account/register' element={<Register />} />
                <Route path='/account/register/verification/:email' element={<VerificationEmail />} />
                <Route path='/account/password-reset/confirm/:uid/:token/' element={<ResetPassword />} />
                <Route path='/account' element={<Profile/>}/>
                <Route path='/pages/:slug' element={<Post/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/checkouts/:buyer' element={<Checkout/>}/>
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