import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import IconArrowRight from '/chevron-right.svg';
import IconArrowLeft from '/chevron-left.svg';

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
);

interface CarouselSliderProps {
  maxItems?: number;
  slideItems?: number;
  mobileMaxItems?: number;
  mobileSlideItems?: number;
  tabletSlideItems?: number;
  tabletMaxItems?: number;
  laptopSlideItems?: number;
  laptopMaxItems?: number;
  children?: React.ReactNode;
  infinite?: boolean;
  dots?: boolean;
  mobileDots?: boolean;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({
  maxItems = 5,
  slideItems = 1,
  children,
  mobileMaxItems = 1,
  mobileSlideItems = 1,
  tabletSlideItems = 2,
  tabletMaxItems = 2,
  laptopSlideItems = 3,
  laptopMaxItems = 3,
  infinite = false,
  dots = true,
  mobileDots = true
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const slider = useRef<any>(null);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);
  const itemCount = React.Children.count(children);
  const settings = {
    dots: dots && itemCount > maxItems,
    arrows: itemCount > maxItems,
    speed: 500,
    slidesToShow: Math.min(maxItems, itemCount),
    slidesToScroll: slideItems,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current: number) => setCurrentSlide(current),
    infinite: infinite,
    centerMode: false,
    centerpadding: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(laptopMaxItems, itemCount),
          slidesToScroll: laptopSlideItems,
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: 0,
          slidesToShow: Math.min(tabletMaxItems, itemCount),
          slidesToScroll: tabletSlideItems,
          centerMode: false,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: 0,
          slidesToShow: Math.min(mobileMaxItems, itemCount),
          slidesToScroll: mobileSlideItems,
          dots: mobileDots && itemCount > mobileMaxItems,
          arrows: false,
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
