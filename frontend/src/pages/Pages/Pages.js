import React, { useEffect, useState } from "react";
import slugify from "slugify";
import '../../assets/styles/Pages.scss';

const Pages = () =>{
    const [url, setUrl] = useState('dat sach tu viet nam');
    const [title, setTitle] = useState('Liên hệ Pre-Order');
    const [content, setContent] = useState(['Để pre-order sách và truyện tranh, xin mời các bạn hãy điền Google Forms hoặc Chat trực tiếp với chúng tôi qua website hoặc Facebook. ',
    'To pre-order books and manga, please complete the Google form or Chat with us via Website or Facebook. '])

    useEffect(()=>{
        const newUrl = slugify(url, {lower: true, remove: /[*+~.()'"!:@]/g});
        setUrl(newUrl);
    },[url])

    return(
        <section className="pages-container">
            <h2>{title}</h2>
            {content.map((item, index) => (
                <p className="content" key={index}>{item}</p>
            ))}
        </section>
    )
}

export default Pages;