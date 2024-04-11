import React, { useEffect } from "react";
import Helmet from 'react-helmet';
import images from "../../assets/images/image";
import '../../assets/styles/Home.scss';
import { Link, useNavigate } from "react-router-dom";
import api from '../../services/api';
import Loading from "../../components/ui/Loading";
import useSWR from 'swr';
import ProductCard from "../../components/ui/ProductCard";
import {useSelector} from 'react-redux';
import useDataMutation from "../../hooks/useDataMutation";

const _fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);


const TITLE = 'Home'

const Home = () =>{
    const navigate = useNavigate();
    const {data, error, isLoading} = useSWR(`/api/products/products/best-sellers/`, _fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();

    const handleShopNow = () => {
        navigate('/collections/all');
    }

    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
            <section className="section-one">
                <h1>Comming Soon</h1>
                <div className="section-one-container">
                    <div className="section-one-content">
                        <div className="image-container">
                            <img src={images.CoomingSoon} alt="comming soon"/>
                        </div>
                        <div className="section-one-contentt">
                            <h3>Tổng hợp tin phát hành sách và truyện tranh</h3>
                            <Link to={'/blogs/tong-hop-tin-phat-hanh'}>Xem thêm <i className="fa-solid fa-arrow-right-long arrow-right-long"></i></Link>
                        </div>
                    </div>
                    <div className="section-one-content">
                        <div className="image-container">
                            <img src={images.Review} alt="review by Loc"/>
                        </div>
                        <div className="section-one-contentt">
                            <h3>Review và Giới thiệu sách</h3>
                            <Link to={'/blogs/reviews'}>Đọc ngay <i className="fa-solid fa-arrow-right-long arrow-right-long"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="shop-now-button-container">
                    <button onClick={()=>handleShopNow()} className="shop-now-button">Shop now</button>
                </div>
            </section>
            <section className="section-two">
                {data &&
                    data.map((item, index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                    ))
                }
        </section>
        </>
    );
}

export default Home;