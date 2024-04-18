import '../../assets/styles/Header.scss'
import toast from "react-hot-toast";

const handleClickHeader = () =>{
    toast('0332649498');
}

const Header = () =>{
    return(
        <div onClick={() => handleClickHeader()} className="header-container">
            <div>Liên hệ qua Zalo hoặc chat với tiệm để pre-order sách nhé!</div>
            <div>Contact us via Zalo or chat with us to pre-order books that are not available on our website {'\u00A0'}
                {/* <i className="fa-solid fa-arrow-right arrow-right"></i> */}
                <i className="fa-solid fa-arrow-right-long arrow-right-long"></i>
            </div>
        </div>
    );
}

export default Header;