import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import '../../assets/styles/SearchBar.scss';

const SearchBar = ({query}) => {
    const [inputText, setInputText] = useState(query ? query : '');
    const [debouncedInputText, setDebouncedInputText] = useState('');
    const [isSearching, setIsSearching] = useState(false); // Khởi tạo isSearching với giá trị false
    const navigate = useNavigate();
    const products = useSelector(state => state.products.books);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        setInputText(query);
    }, [query]);

    const filteredProducts = products.filter(item => {
        const searchText = debouncedInputText.replace(/-/g, '–').toLowerCase();
        
        const searchTerms = searchText.split(' ').filter(term => term.trim() !== '');
        
        return searchTerms.every(term => item.name.toLowerCase().includes(term));
    });
    

    const randomProducts = filteredProducts.sort(() => Math.random() - 0.5).slice(0, 10);
    
    const handleClick = (item)=>{
        setIsInputFocused(true);
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
        setIsInputFocused(false);
        navigate(`/search?q=${inputText}`);
    }

    const handleInputFocus = () => {
        setIsInputFocused(true);
    }

    const handleInputBlur = () => {
    // Delay the execution to ensure the click event on search results is captured
    setTimeout(() => {
        // Check if the input is still not focused after a short delay
        if (!document.activeElement || document.activeElement.id !== "Search") {
            setIsInputFocused(false);
        }
    }, 100);
}


    return(
        <>
            <form className="search-container">
                <div className="form-floating input">
                    <input type="text" className="form-control" id="Search" placeholder="Search" value={inputText} 
                    onChange={(e) => handleSearch(e)} 
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}/>
                    <label htmlFor="search">Search</label>
                    <button type="button" onClick={() => handleSearchClick()} >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            {/* Sử dụng isSearching để kiểm tra và hiển thị ul */}
            {isInputFocused&&  isSearching && randomProducts && 
            <div className="search-list-container">
                    {filteredProducts && filteredProducts.length > 0 &&
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
                    <div>Search for <span>&quot;{inputText}&quot;</span></div>
                    <i className="fa-solid fa-arrow-right-long"></i>
                </div>
            </div>
            }
            </form>
        </>
    )
}

SearchBar.propTypes = {
    query: PropTypes.string
};

export default SearchBar;