import { useEffect, useState } from "react";
import {useSearchParams } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import { Helmet } from "react-helmet";



const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const products = useSelector(state => state.products.books);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();
    const [filtered, setFiltered] = useState('');

    useEffect(() => {
        if (query) {
            const _filtered = products.filter(product => { //Multi Linear Regression
                const searchText = query.replace(/-/g, '–').toLowerCase();
                const searchTerms = searchText.split(' ').filter(term => term.trim() !== '');
                return searchTerms.every(term => product.name.toLowerCase().includes(term));
            });
            setFiltered(_filtered);
            setFilteredProducts(_filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [query, products]);

    const TITLE = `Search: ${filtered ? filtered.length : '0'} results found for "${query}"`;


    return(
        <section>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div className="search-section">
                <SearchBar query={query}/>
            </div>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredProducts} setData={setFilteredProducts} _data={filtered ? filtered : []}/>
            {filteredProducts && filteredProducts.length > 0 ?
                filteredProducts.slice().sort(() => Math.random() - 0.5).map((item,index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))
                : <div>Không có</div>
            }
        </section>
    )
}

export default SearchResult;