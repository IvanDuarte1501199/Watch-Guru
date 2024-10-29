import React from 'react';
import { TeaserListProps } from '@appTypes/teaser/teasers';
import Teaser from './Teaser';
import CarouselSlider from '@components/common/CarouselSlider';

const TeaserList: React.FC<TeaserListProps> = ({ teasers, customClass }) => {
  return (
    <section className={`mb-8 md:mb-16 ${customClass}`}>
      <CarouselSlider maxItems={3} slideItems={3} mobileMaxItems={1} mobileSlideItems={1}>
        {teasers.map((teaser) => (
          <Teaser teaser={teaser} key={teaser.id} />
        ))}
      </CarouselSlider>
    </section>
  );
};

export default TeaserList;
