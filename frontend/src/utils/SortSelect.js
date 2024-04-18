import React, { useEffect, useState } from 'react';
import '../assets/styles/SortSelect.scss';

const SortSelect = ({ value, setValue, data, setType, available, unAvailable, setIsInStock, setIsOutOfStock, isInStock, isOutOfStock }) => {
    const [selectedCount, setSelectedCount] = useState(0);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [isPriceFilter, setIsPriceFilter] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (value === '-sold_count'){
            setType(value);
        }else if(value === 'name'){
            setType(value);
        }else if(value === '-name'){
            setType(value);
        }else if(value === 'final_price'){
            setType(value);
        }else if(value === '-final_price'){
            setType(value);
        }else if(value === 'created_at'){
            setType(value);
        }else if(value === '-created_at'){
            setType(value);
        }else if(value === null){
            setType(value);
        }
    }, [value, setType])

    const handleSortChange = (e) => {
        setValue(e.target.value);
    };
    useEffect(() => {
        const inStockCheckbox = document.getElementById('inStockCheckbox');
        const outOfStockCheckbox = document.getElementById('outOfStockCheckbox');
        if(isInStock){
            inStockCheckbox.checked = true;
        }
        if(isOutOfStock){
            outOfStockCheckbox.checked = true;
        }
    }, [])

    const handleReset = () => {
        const inStockCheckbox = document.getElementById('inStockCheckbox');
        const outOfStockCheckbox = document.getElementById('outOfStockCheckbox');
        setSelectedCount(0);
        if (inStockCheckbox) inStockCheckbox.checked = false;
        if (outOfStockCheckbox) outOfStockCheckbox.checked = false;
    };

    const handleCheckboxChange = (e) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let count = 0;
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                count++;
            }
        });
        setSelectedCount(count);
        if (document.getElementById('inStockCheckbox').checked && document.getElementById('outOfStockCheckbox').checked) {
            setIsInStock(true);
            setIsOutOfStock(true);
        } else if (document.getElementById('inStockCheckbox').checked) {
            setIsInStock(true);
            setIsOutOfStock(false);
        } else if (document.getElementById('outOfStockCheckbox').checked) {
            setIsInStock(false);
            setIsOutOfStock(true);
        } else{            
            setIsInStock(false);
            setIsOutOfStock(false);
        }
    };
    
    const handleMaxPriceChange = (e) => {
            setMaxPrice(e.target.value);
    };

    const handleMinPriceChange = (e) => {
            setMinPrice(e.target.value);
    };

    const handleResetMinMax = () => {
        setMinPrice('');
        setMaxPrice('');
    };

    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => {
            if (!minPrice || !maxPrice) {
                setIsPriceFilter(false);
            } else {
                setIsPriceFilter(true);
            }
            setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [minPrice, maxPrice]);

    return (
        <div className="arrange">
            <div className='filter-container'>
                <div className='filter'>
                    <div className='filter-option'>Filter:</div>
                    <details className='availability disclosure-has-popup'>
                        <summary>
                            Availability <i className="fa-solid fa-chevron-down"></i>
                        </summary>
                        <div className='filter-menu'>
                            <div className='filter-menu-title'>
                                <span> {selectedCount} selected</span>
                                <facet-remove>
                                    <a role='button' onClick={handleReset}>Reset</a>
                                </facet-remove>
                            </div>
                            <div>
                                <fieldset>
                                    <ul>
                                        <li>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value={isInStock} id='inStockCheckbox' onChange={handleCheckboxChange}/>
                                                <span>In stock ({available})</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value={isOutOfStock} id='outOfStockCheckbox' onChange={handleCheckboxChange}/>
                                                <span>Out of stock ({unAvailable})</span>
                                            </label>
                                        </li>
                                    </ul>
                                </fieldset>
                            </div>
                        </div>
                    </details>
                    <details className='price disclosure-has-popup'>
                        <summary> 
                            Price <i className="fa-solid fa-chevron-down"></i>
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
                        <option defaultValue={null} value={null}>Featured</option>
                        <option value="-sold_count">Best Selling</option>
                        <option value="name">Alphabetically, A-Z</option>
                        <option value="-name">Alphabetically, Z-A</option>
                        <option value="final_price">Price, low to high</option>
                        <option value="-final_price">Price, high to low</option>
                        <option value="created_at">Date, new to old</option>
                        <option value="-created_at">Date, old to new</option>
                    </select>
                    <div className='value'>
                        {data && data.count &&
                            <span>{data.count} products</span>
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
