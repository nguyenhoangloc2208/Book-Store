import React, { useEffect, useState } from "react";
import '../../assets/styles/Navbar.scss';
import logo from '../../assets/images/logo.webp';
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar";

const Navbar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const [isShowSearchBar, setIsShowSearchBar] = useState(false);

    const handleShowSearchBar = () =>{
        if (isShowSearchBar === false){
            setIsShowSearchBar(true);
        } else {
            setIsShowSearchBar(false);
        }
    }

    const handleAccountLogin = () =>{
        navigate("/account/login");
    }

    const handleCart = () =>{
        navigate("/cart");
    }

    const handleLogoClick = () =>{
        navigate("/");
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
                    <i onClick={() => handleShowSearchBar()} class="fa-solid fa-magnifying-glass"></i>
                    <i onClick={() => handleAccountLogin()} class="fa-regular fa-user"></i>
                    <i onClick={() => handleCart()} class="fa-solid fa-bag-shopping"></i>
                </div>
            </div>
        </div>
        <SearchBar isOpen={isShowSearchBar} setIsOpen={setIsShowSearchBar}/>
        <hr/>
        </>
    );
}

export default Navbar;