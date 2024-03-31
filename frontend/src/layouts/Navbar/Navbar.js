import React, { useEffect, useState } from "react";
import '../../assets/styles/Navbar.scss';
import images from "../../assets/images/image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../services/auth.service";
import { setOrderPending } from "../../store/slice/OrderSlice";
import api from '../../services/api'
import useSWR, { mutate } from "swr";
import useDataMutation from "../../hooks/useDataMutation";

const fetcher = (url) => api.get(url).then(res => res[0]);


const Navbar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const [isShowSearchBar, setIsShowSearchBar] = useState(false);
    const isLogin = useSelector(state => state.auth.isLogin);
    const dispatch = useDispatch();
    // const {data, error, isLoading} = useSWR(isLogin ? '/api/user/orders/pending_order/' : null, fetcher, {refreshInterval: null});
    const {data, error, isLoading, updateData} = useDataMutation('/api/user/orders/pending_order');

    
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.navbar-container');
            const headerHeight = header.offsetHeight;
            const scrollPosition = window.scrollY;
            const hideOffset = 50;
            if (scrollPosition > headerHeight - hideOffset) {
                header.classList.add('navbar-hidden');
            } else {
                header.classList.remove('navbar-hidden');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            dispatch(setOrderPending(data));
        }else {
            dispatch(setOrderPending({ total_quantity: 0, id: 0 }));
        }
    }, [data, dispatch, location])
    
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
            dispatch(setOrderPending(0));
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
                    <img onClick={()=>handleLogoClick()} style={{cursor: "pointer"}} src={images.Logo} alt="logo" width={190}/>
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
                    <div className="cart-quantity" onClick={() => handleCart()}>
                        <i  className="fa-solid fa-bag-shopping"></i>
                        {
                            data && data?.total_quantity > 0 && <div className="circle">
                            <span>{data.total_quantity}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <SearchBar isOpen={isShowSearchBar} setIsOpen={setIsShowSearchBar}/>
        </>
    );
}

export default Navbar;