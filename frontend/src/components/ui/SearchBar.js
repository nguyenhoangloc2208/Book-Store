import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/SearchBar.scss"
import { useSelector } from "react-redux";

const SearchBar = ({isOpen, setIsOpen}) =>{
    const [inputText, setInputText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const products = useSelector(state => state.products.books);

    // const filteredProducts = products.filter((item) =>
    // item.name.toLowerCase().includes(inputText.toLowerCase())
    // );
    const filteredProducts = useState();

    const handleClick = (item)=>{
        navigate(`/products/${item.slug}`)
        setInputText('');
        setIsSearching(false);
    }

    const handleSearch = (e) => {
        setInputText(e.target.value);
    
        if (e.target.value) {
          setIsSearching(true); // Bật trạng thái tìm kiếm khi có nội dung
        } else {
          setIsSearching(false); // Tắt trạng thái tìm kiếm khi không có nội dung
        }
      }
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
                        <div>
                            <input type="text" name="q" placeholder="Search" aria-label="Search" value={inputText} onChange={(e) => handleSearch(e)}/>
                            <button type="button" onClick={() => handleSearchClick()} >
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </form>
                    <i onClick={() => setIsOpen(false)} className="fa-solid fa-xmark xmark"></i>
                    <div>
                    <ul className='search-list'>
                    {isSearching && filteredProducts.map((item) => (
                        <li onClick={()=> handleClick(item)} key={item.id}>
                            {/* <img alt="" src={item.image[0]?.image || ''}/>  */}
                        <span>{item.name}<br/>{parseInt(item.price).toLocaleString('en-US').replace(/,/g, '.')}₫</span>
                        </li>
                        ))}
                </ul>
                    </div>
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