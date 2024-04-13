import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const isScrolling = useRef(false);

    useEffect(() => {
        const handleScroll = (event) => {
            if (isScrolling.current) {
                event.preventDefault();
                return;
            }
            isScrolling.current = true;
            setTimeout(() => {
                isScrolling.current = false;
            }, 250);
        };

        window.addEventListener('scroll', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
