import React from 'react';
import CarouselSlider from '@components/common/CarouselSlider';
import PopularCarouselItem, { PopularCarouselItemProps } from './PopularCarouselItem';

interface PopularCarouselProps {
  items: PopularCarouselItemProps[];
  customClass?: string;
}


const PopularCarousel: React.FC<PopularCarouselProps> = ({ items, customClass }) => {
  return (
    <section className={`${customClass}`}>
      <CarouselSlider mobileDots={false} dots={false} maxItems={2} slideItems={2}
        mobileMaxItems={1} mobileSlideItems={1}
        tabletMaxItems={1} tabletSlideItems={1}
        laptopMaxItems={1} laptopSlideItems={1} autoplay autoplaySpeed={4000} infinite>
        {items.map((item) => (
          <PopularCarouselItem {...item} key={item.id} />
        ))}
      </CarouselSlider>
    </section>
  );
};

export default PopularCarousel;
