import "../../assets/styles/Footer.scss"
import { Link } from "react-router-dom";

const Footer = () =>{
    return(
        <>
            <footer className="footer">
            <div className="footer-container">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Chính sách vận chuyển–Shipping Policy</h3>
                        <ul className="m-lg-3">
                            <li>Với các đầu sách có sẵn tại website, sách sẽ được ship out sau 1-3 ngày. Books in stock will be shipped out in 1-3 days.</li>
                            <li>Với các đầu sách pre-order, sách có sẵn từ 2-4 tuần sau khi order. Pre-ordered books are available in 2-4 weeks after the order is confirmed.</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h3>Pre-order sách và manga—Pre-order</h3>
                        <div>Để pre-order sách hoặc manga, vui lòng liên hệ với chúng tôi qua <Link className="link">Facebook Fanpage</Link></div>
                        <div>To pre-order books or manga, please connect with us via our <Link className="link">Facebook Fanpage (Tiệm sách Việt nhỏ)</Link> or fill our this <Link className="link">FORM</Link>.</div>
                    </div>
                </div>
            </div>
            </footer>
        </>
    );
}

export default Footer;