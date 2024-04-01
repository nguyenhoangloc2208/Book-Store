import React, { useEffect } from "react";
import Helmet from 'react-helmet';

const TITLE = 'Home'

const Home = () =>{


    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
        <div>
            <h3>Chào mừng bạn đến với trang Web 👋</h3>
        </div>
        </>
    );
}

export default Home;