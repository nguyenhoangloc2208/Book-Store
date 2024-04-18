import { useEffect } from 'react';
import '../../assets/styles/Loading.scss';

function Loading() {
useEffect(() => {
    const bounce = () => {
    let ball = document.querySelector(".loading-ball");
    ball.style.transition = "0.2s";
    ball.style.width = "55px";
    ball.style.bottom = "-101px";
    setTimeout(() => {
        ball.style.bottom = "0px";
        ball.style.transition = "0.4s";
        ball.style.width = "50px";
    }, 450);
    };

    const intervalId = setInterval(bounce, 1000);

    return () => clearInterval(intervalId);
}, []); // Empty dependency array to run only once on component mount

return (
    <div className="loading-container">
    <div className="loading">
        <img className="loading-ball" src="https://cdn-icons-png.flaticon.com/512/587/587393.png" alt="" />
    </div>
    </div>
);
}

export default Loading;
