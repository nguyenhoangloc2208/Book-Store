import React from "react";
import "../../assets/styles/Footer.scss"
import { Link } from "react-router-dom";

const Footer = () =>{
    return(
        <>
            <footer className="footer">
            <div className="footer-container">
                <div className="row">
                <div className="col-md-6">
                    <h3>Liên hệ với chúng tôi</h3>
                    <div className="m-lg-3">
                        <p>Email: nguyenhoangloc2208@gmail.com</p>
                        <p>Số điện thoại: 0332 649 498</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>Đường dẫn</h3>
                    <ul className="m-lg-3">
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/shop">Danh mục sản phẩm</Link></li>
                    <li><Link to="/abouts">Thông tin</Link></li>
                    </ul>
                </div>
                </div>
            </div>
            </footer>
        </>
    );
}

export default Footer;