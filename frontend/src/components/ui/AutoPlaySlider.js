import React, { useRef } from "react";
import Slider from "react-slick";
import SliderCard from "./SliderCard";
import '../../assets/styles/SliderCard.scss';


const AutoPlaySlider = ({item}) => {
    let sliderRef = useRef(null);

    const next = () => {
        sliderRef.slickNext();
    };

    const previous = () => {
        sliderRef.slickPrev();
    };

    var settings = {
        // dots: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };
    return (
        <div className="auto-slider-container">
            <Slider
                ref={slider => {
                    sliderRef = slider;
                }}
            {...settings}>
            {item && item.length > 0 && item.slice(0,5).map((item, index)=>(
                <SliderCard key={index} item={item} index={index} />
            ))}
            </Slider>
            <div style={{ textAlign: "center" }}>
                <div className="next-prev-slider-btn prev-slider-btn" onClick={previous}>
                    <i className="fa-solid fa-chevron-left"></i>
            </div>
                <div className="next-prev-slider-btn next-slider-btn" onClick={next}>
                    <i className="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        </div>
    );
}

export default AutoPlaySlider;
