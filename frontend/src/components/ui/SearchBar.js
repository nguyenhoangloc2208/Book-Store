import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/SearchBar.scss"
import { useSelector } from "react-redux";

const SearchBar = ({isOpen, setIsOpen}) =>{
    const [inputText, setInputText] = useState('');
    const [debouncedInputText, setDebouncedInputText] = useState('');
    const [isSearching, setIsSearching] = useState(false); // Khởi tạo isSearching với giá trị false
    const navigate = useNavigate();
    const products = useSelector(state => state.products.books);

    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(debouncedInputText.toLowerCase())
    );

    const randomProducts = filteredProducts.sort(() => Math.random() - 0.5).slice(0, 3);
    
    const handleClick = (item)=>{
        setIsOpen(false);
        navigate(`/products/${item.slug}`)
        setInputText('');
        setIsSearching(false);
    }

    const handleSearch = (e) => {
        setInputText(e.target.value);

        // Cập nhật isSearching dựa trên có nội dung nhập hay không
        setIsSearching(!!e.target.value.trim());
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInputText(inputText);
        }, 2000); // Delay 2 giây

        return () => {
            clearTimeout(timer);
        };
    }, [inputText]);

    const handleSearchClick = () =>{
        navigate(`/search/${inputText}`);
    }

    useEffect(() => {
        if(isOpen){
            document.body.classList.add("no-scroll");
        } else{
            document.body.classList.remove("no-scroll");
        }
    }, [isOpen])

    return(
        <>
            {
            isOpen ? (
                <div className="overlay">
                    <div className="search-background">
                    <form className="search-container">
                        <div className="form-floating input">
                        <input type="text" className="form-control" id="Search" placeholder="Search" value={inputText} onChange={(e) => handleSearch(e)} />
                        <label htmlFor="search">Search</label>
                        <button type="button" onClick={() => handleSearchClick()} >
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                    {/* Sử dụng isSearching để kiểm tra và hiển thị ul */}
                    {isSearching && filteredProducts && 
                    <>
                        <ul className='search-list'>
                            <div className="search-list-title">Products</div>
                            {randomProducts.map((item) => (
                                <>
                                    <li onClick={()=> handleClick(item)} key={item.id}>
                                        <div className="image-container">
                                            <img alt="" src={item.image[0]?.image || ''}/> 
                                        </div>
                                        <span>{item.name}<br/>{parseInt(item.price).toLocaleString('en-US').replace(/,/g, '.')}₫</span>
                                    </li>
                                </>
                            ))}
                        <div>
                            <div>Search for <span>{inputText}</span></div>
                        </div>
                        </ul>
                    </>
                    }
                    </form>
                    <i onClick={() => setIsOpen(false)} className="fa-solid fa-xmark xmark"></i>
                    </div>
                    <div onClick={() => setIsOpen(false)} className="background">

                    </div>
                </div>
                ) : null
            }
        </>
    )
}

export default SearchBar;
