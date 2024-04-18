import { useEffect, useState } from "react";
import '../../assets/styles/Navbar.scss';
import images from "../../assets/images/image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthService from "../../services/auth.service";
import { setOrderPending } from "../../store/slice/OrderSlice";
import useDataMutation from "../../hooks/useDataMutation";
import {toast} from 'react-hot-toast';
import Cookies from "js-cookie";
import SearchBarOverlay from "../../components/ui/SearchBarOverlay";



const Navbar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const [isShowSearchBar, setIsShowSearchBar] = useState(false);
    const dispatch = useDispatch();
    const {data, updateData} = useDataMutation();
    const isLoggedInStr = Cookies.get('isLoggedIn');

    
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
        if(isLoggedInStr !== 'true'){
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
            if(isLoggedInStr === 'true') {await updateData();}
            await AuthService.logout();
            dispatch(setOrderPending(0));
            toast.success('Logout success!');
            navigate('/');
        }catch(error){
            console.error(error);
        }
    }

    return(
        <div className="navbar-containerr">
        <div className="navbar-container">
            <div className="row gutters-sm">
                <div className="col-md-3">
                    <img onClick={()=>handleLogoClick()} style={{cursor: "pointer"}} src={images.Logo} alt="logo" width={190}/>
                </div>
                <div className="col-md-7">
                    <ul className="menu-list">
                        <li><Link to="/" className={location.pathname === "/" ? "text-decoration-underline" : ""}>Trang chủ - Home Page</Link></li>
                        <li><Link to="/collections" className={location.pathname === "/collections" ? "text-decoration-underline" : ""}>Danh mục sách - Collections</Link></li>
                        <li><Link to="/pages/ap-u-mot-giac-mo-va-niem-tu-hao-sach-viet-tren-dat-my" className={location.pathname === "/pages/ap-u-mot-giac-mo-va-niem-tu-hao-sach-viet-tren-dat-my" ? "text-decoration-underline" : ""}>Câu chuyện của chúng tôi - Our Story</Link></li>
                        <li><Link to="/pages/pre-order" className={location.pathname === "/pages/pre-order" ? "text-decoration-underline" : ""}>Liên hệ Pre-Order</Link></li>
                        <li><Link to="/blogs/reviews" className={location.pathname === "/blogs/reviews" ? "text-decoration-underline" : ""}>Review Sách và Truyện tranh - Book & Manga Review</Link></li>
                        <li><Link to="/pages/vietnamese-books-for-libraries-in-the-us" className={location.pathname === "/pages/vietnamese-books-for-libraries-in-the-us" ? "text-decoration-underline" : ""}>For Libraries</Link></li>
                        {/* <li><Link to="/blogs/our-blogs" className={location.pathname === "/blogs/our-blogs" ? "text-decoration-underline" : ""}>Our blogs</Link></li> */}
                    </ul>
                </div>
                <div className="col-md-2">
                    <i onClick={() => handleShowSearchBar()} className="fa-solid fa-magnifying-glass"></i>
                    <div className="dropdown">
                        <i onClick={() => handleAccount()} className="fa-regular fa-user user"></i>
                        {isLoggedInStr === 'true' && <div className="dropdown-content">
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
        <div className="overlay-container">
            <SearchBarOverlay isOpen={isShowSearchBar} setIsOpen={setIsShowSearchBar}/>
        </div>
        </div>
    );
}

export default Navbar;