import React, { useEffect, useState } from 'react';
import '../assets/styles/SortSelect.scss';
import Sort from './Sort';

const SortSelect = ({ value, setValue, data, setData, _data, setType }) => {
    const [selectedCount, setSelectedCount] = useState(0);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    // const available = _data.filter(_data => _data.count_in_stock > 0);
    // const unAvailable = _data.filter(_data => _data.count_in_stock === 0);
    const [isInStock, setIsInStock] = useState(false);
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [isPriceFilter, setIsPriceFilter] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (value === 'sort-by-best-selling/'){
            setType(value);
            // setData(Sort.bestSelling(-data));
        }else if(value === 'sort-by-name-asc/'){
            setType(value);
            // setData(Sort.sortAZ(-data));
        }else if(value === 'sort-by-name-desc/'){
            setType(value);
            // setData(Sort.sortZA(-data));
        }else if(value === 'sort-by-price-asc/'){
            setType(value);
            // setData(Sort.sortPriceMinToMax(-data));
        }else if(value === 'sort-by-price-desc/'){
            setType(value);
            // setData(Sort.sortPriceMaxToMin(-data));
        }else if(value === 'sort-by-date-asc/'){
            setType(value);
            // setData(Sort.sortCreatedAtNew(-data));
        }else if(value === 'sort-by-date-desc/'){
            setType(value);
            // setData(Sort.sortCreatedAtOld(_data));
        }else if(value === null){
            setType(value);
        }
    }, [value, setType])

    const handleSortChange = (e) => {
        setValue(e.target.value);
    };

    const handleReset = () => {
        // Get checkboxes for "In stock" and "Out of stock"
        const inStockCheckbox = document.getElementById('inStockCheckbox');
        const outOfStockCheckbox = document.getElementById('outOfStockCheckbox');
        setSelectedCount(0);
        // Reset checkboxes to their initial state (unchecked)
        if (inStockCheckbox) inStockCheckbox.checked = false;
        if (outOfStockCheckbox) outOfStockCheckbox.checked = false;
    };

    // const handleCheckboxChange = (e) => {
    //     const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    //     let count = 0;
    //     checkboxes.forEach((checkbox) => {
    //         if (checkbox.checked) {
    //             count++;
    //         }
    //     });
    //     setSelectedCount(count);
    //     if (document.getElementById('inStockCheckbox').checked && document.getElementById('outOfStockCheckbox').checked) {
    //         setData(_data);
    //         setIsInStock(true);
    //         setIsOutOfStock(true);
    //     } else if (document.getElementById('inStockCheckbox').checked) {
    //         setData(available);
    //         setIsInStock(true);
    //         setIsOutOfStock(false);
    //     } else if (document.getElementById('outOfStockCheckbox').checked) {
    //         setData(unAvailable);
    //         setIsInStock(false);
    //         setIsOutOfStock(true);
    //     } else{            
    //         setIsInStock(false);
    //         setIsOutOfStock(false);
    //         setData(_data);
    //     }
    // };
    
    const handleMaxPriceChange = (e) => {
            setMaxPrice(e.target.value);
    };

    const handleMinPriceChange = (e) => {
            setMinPrice(e.target.value);
    };

    const handleResetMinMax = () => {
        // Đặt lại giá trị của các trường "From" và "To" về giá trị mặc định
        setMinPrice('');
        setMaxPrice('');
    };

    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => {
            if (!minPrice || !maxPrice) {
                setIsPriceFilter(false); // Nếu một trong hai là undefined, không set isPriceFilter
            } else {
                setIsPriceFilter(true); // Nếu cả hai đều có giá trị, set isPriceFilter
            }
            setIsTyping(false);
        }, 2000); // 2 giây
        return () => clearTimeout(timer);
    }, [minPrice, maxPrice]);

    return (
        <div className="arrange">
            <div className='filter-container'>
                <div className='filter'>
                    <div className='filter-option'>Filter:</div>
                    <details className='availability disclosure-has-popup'>
                        <summary>
                            Availability <i class="fa-solid fa-chevron-down"></i>
                        </summary>
                        <div className='filter-menu'>
                            <div className='filter-menu-title'>
                                <span> {selectedCount} selected</span>
                                <facet-remove>
                                    <a role='button' onClick={handleReset}>Reset</a>
                                </facet-remove>
                            </div>
                            <div>
                                {/* <fieldset>
                                    <ul>
                                        <li>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' id='inStockCheckbox' onChange={handleCheckboxChange}/>
                                                <span>In stock ({available.length})</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' id='outOfStockCheckbox' onChange={handleCheckboxChange}/>
                                                <span>Out of stock ({unAvailable.length})</span>
                                            </label>
                                        </li>
                                    </ul>
                                </fieldset> */}
                            </div>
                        </div>
                    </details>
                    <details className='price disclosure-has-popup'>
                        <summary> 
                            Price <i class="fa-solid fa-chevron-down"></i>
                        </summary>
                            <div className='filter-menu'>
                                <div className='filter-menu-title'>
                                    <span> The highest price is</span>
                                    <facet-remove>
                                        <a role='button' onClick={handleResetMinMax}>Reset</a>
                                    </facet-remove>
                                </div>
                                <div>
                                    <fieldset>
                                        {/* <legend>Contact Information</legend> */}
                                        <div className='input-container'>
                                            <div className="form-floating input">
                                                <input type="text" className="form-control" id="From" placeholder="From" value={minPrice} onChange={handleMinPriceChange} />
                                                <label htmlFor="From">From</label>
                                            </div>
                                            <div className="form-floating input">
                                                <input type="text" className="form-control" id="To" placeholder="To" value={maxPrice} onChange={handleMaxPriceChange} />
                                                <label htmlFor="To">To</label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                    </details>
                </div>
            </div>
            <div className='sort-container'>
                <div className='sort'>
                    <span>Sort by: </span>
                    <select className="form-select" id="floatingSelect" aria-label="Floating label select example" value={value} onChange={handleSortChange}>
                        <option defaultValue={null}>Featured</option>
                        <option value="sort-by-best-selling/">Best Selling</option>
                        <option value="sort-by-name-asc/">Alphabetically, A-Z</option>
                        <option value="sort-by-name-desc/">Alphabetically, Z-A</option>
                        <option value="sort-by-price-asc/">Price, low to high</option>
                        <option value="sort-by-price-desc/">Price, high to low</option>
                        <option value="sort-by-date-asc/">Date, new to old</option>
                        <option value="sort-by-date-desc/">Date, old to new</option>
                    </select>
                    <div className='value'>
                        {data && data.length &&
                            <span>{data.length} products</span>
                        }
                    </div>
                </div>
            </div>
            <div className='filter-option-show'>
                {isInStock && 
                    <div>Availability: In stock</div>
                }
                {isOutOfStock && 
                    <div>Availability: Out of stock</div>
                }
                {!isTyping && isPriceFilter && minPrice !== '' && maxPrice !== '' &&
                    <div>{minPrice} - {maxPrice}</div>
                }
            </div>
        </div>
    );
};

export default SortSelect;
