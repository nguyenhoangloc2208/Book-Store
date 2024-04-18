import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/SearchBarOverlay.scss"
import { useSelector } from "react-redux";

const SearchBar = ({isOpen, setIsOpen}) =>{
    const [inputText, setInputText] = useState('');
    const [debouncedInputText, setDebouncedInputText] = useState('');
    const [isSearching, setIsSearching] = useState(false); // Khởi tạo isSearching với giá trị false
    const navigate = useNavigate();
    const products = useSelector(state => state.products.books);

    const filteredProducts = products.filter(item => {
        const searchText = debouncedInputText.replace(/-/g, '–').toLowerCase();
        const searchTerms = searchText.split(' ').filter(term => term.trim() !== '');
        return searchTerms.every(term => item.name.toLowerCase().includes(term));
    });

    const randomProducts = filteredProducts.sort(() => Math.random() - 0.5).slice(0, 10);
    
    const handleClick = (item)=>{
        setIsOpen(false);
        navigate(`/products/${item.slug}`)
        setInputText('');
        setIsSearching(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchClick();
        }
    }

    const handleSearch = (e) => {
        setInputText(e.target.value);

        // Cập nhật isSearching dựa trên có nội dung nhập hay không
        setIsSearching(!!e.target.value.trim());
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInputText(inputText);
        }, 1000); // Delay 2 giây

        return () => {
            clearTimeout(timer);
        };
    }, [inputText]);

    const handleSearchClick = () =>{
        setIsOpen(false);
        navigate(`/search?q=${inputText}`);
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
                        <input type="text" className="form-control" id="Search" placeholder="Search" value={inputText} onChange={(e) => handleSearch(e)} onKeyDown={handleKeyDown}/>
                        <label htmlFor="search">Search</label>
                        <button type="button" onClick={() => handleSearchClick()} >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                    {/* Sử dụng isSearching để kiểm tra và hiển thị ul */}
                    {isSearching && filteredProducts && 
                    <div className="search-list-container">
                        {randomProducts && randomProducts.length > 0 &&
                            <div className="search-list-title">Products</div>
                        }
                        <ul className='search-list'>
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
                        </ul>
                        <div onClick={() => handleSearchClick()} className="search-for">
                            <div>Search for <span>"{inputText}"</span></div>
                            <i className="fa-solid fa-arrow-right-long"></i>
                        </div>
                    </div>
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
