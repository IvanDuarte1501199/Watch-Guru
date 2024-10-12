import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

/* TODO: add custom arrows and dots */
/* import IconArrowRight from '/icon-arrow-right.svg';
import IconArrowLeft from '/icon-arrow-left.svg';

interface SliderArrowProps {
    onClick?: () => void;
    className?: string;
}

const NextArrow: React.FC<SliderArrowProps> = ({ className, onClick }) => (
    <div className={`${className} absolute right-0 z-10`} onClick={onClick}>
        <img src={IconArrowRight} alt="Next slide" />
    </div>
);

const PrevArrow: React.FC<SliderArrowProps> = ({ className, onClick }) => (
    <div className={`${className} absolute left-0 z-10`} onClick={onClick}>
        <img src={IconArrowLeft} alt="Previous slide" />
    </div>
); */

interface CarouselSliderProps {
    maxItems?: number;
    children?: React.ReactNode;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({
    maxItems = 5,
    children,
}) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const slider = useRef<any>(null);

    useEffect(() => {
        setCurrentSlide(0);
    }, []);

    const settings = {
        dots: true,
        arrows: true,
        speed: 500,
        slidesToShow: maxItems,
        slidesToScroll: 1,
        afterChange: (current: number) => setCurrentSlide(current),
        infinite: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: 0,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerMode: true,
                    arrows: false,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    centerPadding: 0,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false,
                },
            },
        ],
    };

    return (
        <section className="carousel-container">
            <Slider {...settings} ref={slider}>
                {children}
            </Slider>
        </section>
    );
};

export default CarouselSlider;
