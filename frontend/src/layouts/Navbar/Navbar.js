import React, { useEffect, useState } from "react";
import '../../assets/styles/Navbar.scss';
import logo from '../../assets/images/logo.webp';
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../services/auth.service";
import { setIsLogin } from "../../store/slice/AuthSlice";
import CartService from "../../services/cart.service";
import { setOrderCompleted, setOrderPending } from "../../store/slice/OrderSlice";


const Navbar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isShowSearchBar, setIsShowSearchBar] = useState(false);
    const isLogin = useSelector(state => state.auth.isLogin);
    const total_quantity = useSelector(state => state.order.total_quantity);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isLoaded && isLogin) {
            fetchOrderData();
            setIsLoaded(true);
        }
    }, [isLoaded, isLogin])

    const fetchOrderData = async () => {
        try{
            const order_data = await CartService.CartList();
            console.log('order_data', order_data);
            if(order_data && order_data.length > 0){
                const orderPeiding = order_data.filter(order_data => order_data.status === "P");   
                console.log('orderPending', orderPeiding);             
                const orderCompleted = order_data.filter(order_data => order_data.status === "C");
                if(orderPeiding){
                    dispatch(setOrderPending(orderPeiding[0]));
                }
                if(orderCompleted){
                    dispatch(setOrderCompleted(orderCompleted));
                }
            }
        }catch(error){
            console.error(error);
        }
    }

    const handleShowSearchBar = () =>{
        if (isShowSearchBar === false){
            setIsShowSearchBar(true);
        } else {
            setIsShowSearchBar(false);
        }
    }

    const handleAccount = () =>{
        if(isLogin){
        }else{
            navigate("/account/login");
        }
    }

    const handleCart = () =>{
        navigate("/cart");
    }

    const handleLogoClick = () =>{
        navigate("/");
    }
    
    const handleLogout = async () => {
        try{
            await AuthService.logout();
            dispatch(setIsLogin(false));
            dispatch(setOrderPending({}));
            dispatch(setOrderCompleted([]));
            alert('Logout success!');
        }catch(error){
            console.error(error);
        }
    }

    return(
        <>
        <div className="navbar-container">
            <div className="row gutters-sm">
                <div className="col-md-3">
                    <img onClick={()=>handleLogoClick()} style={{cursor: "pointer"}} src={logo} alt="logo" width={190}/>
                </div>
                <div className="col-md-7">
                    <ul className="menu-list">
                        <li><Link to="/" className={location.pathname === "/" ? "text-decoration-underline" : ""}>Trang chủ - Home Page</Link></li>
                        <li><Link to="/collections" className={location.pathname === "/collections" ? "text-decoration-underline" : ""}>Danh mục sách - Collections</Link></li>
                        <li><Link to="/pages/about" className={location.pathname === "/pages/about" ? "text-decoration-underline" : ""}>Câu chuyện của chúng tôi - Our Story</Link></li>
                        <li><Link to="/pages/pre-order" className={location.pathname === "/pages/pre-order" ? "text-decoration-underline" : ""}>Liên hệ Pre-Order</Link></li>
                        <li><Link to="/blogs/reviews" className={location.pathname === "/blogs/reviews" ? "text-decoration-underline" : ""}>Review Sách và Truyện tranh - Book & Manga Review</Link></li>
                        <li><Link to="/pages/books-for-libraries" className={location.pathname === "/pages/books-for-libraries" ? "text-decoration-underline" : ""}>For Libraries</Link></li>
                        <li><Link to="/blogs/our-blogs" className={location.pathname === "/blogs/our-blogs" ? "text-decoration-underline" : ""}>Our blogs</Link></li>
                    </ul>
                </div>
                <div className="col-md-2">
                    <i onClick={() => handleShowSearchBar()} className="fa-solid fa-magnifying-glass"></i>
                    <div className="dropdown">
                        <i onClick={() => handleAccount()} className="fa-regular fa-user user"></i>
                        {isLogin && <div className="dropdown-content">
                            <Link to='./account/'>Profile</Link>
                            <Link as="button" onClick={()=>handleLogout()}>Logout</Link>
                        </div>}
                    </div>
                    <div className="cart-quantity">
                        <i onClick={() => handleCart()} className="fa-solid fa-bag-shopping"></i>
                        {total_quantity > 0 && <div className="circle">
                            <span>{total_quantity}</span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        <SearchBar isOpen={isShowSearchBar} setIsOpen={setIsShowSearchBar}/>
        <hr/>
        </>
    );
}

export default Navbar;