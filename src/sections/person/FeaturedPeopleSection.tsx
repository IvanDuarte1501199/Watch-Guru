import React from 'react';
import { PersonProps } from '@appTypes/person/personProps';
import { Link } from 'react-router-dom';
import CarouselSlider from '@components/common/CarouselSlider';

interface FeaturedPeopleSectionProps {
  people: FeaturedPersonProps[];
  customClass?: string;
}

type FeaturedPersonProps = Pick<PersonProps, 'id' | 'name' | 'profile_path' | 'known_for_department'>;

const FeaturedPeopleSection: React.FC<FeaturedPeopleSectionProps> = ({ people, customClass }) => {
  return (
    <section className={`mb-12 md:mb-16 ${customClass}`}>
      <h2 className='h2-guru mb-4 text-center'>Featured People</h2>
      <CarouselSlider maxItems={5} slideItems={5} mobileMaxItems={2} dots={false}
        mobileSlideItems={2}>
        {people.map((person) => (
          <Link to={`/person/${person.id}`} key={person.id} className='pt-2'>
            <div>
              <img
                loading="lazy"
                src={person.profile_path ? `https://image.tmdb.org/t/p/w500/${person.profile_path}` : '/user.svg'}
                alt={person.name}
                className={` mb-2 w-full h-full bg-white transition-transform overflow-visible hover:scale-105 ${person.profile_path ? 'object-cover' : 'py-14'}`}
              />
              <h3 className="text-lg h2-guru font-semibold">{person.name}</h3>
              <p className="text-sm p-guru text-secondary text-gray-400">{person.known_for_department}</p>
            </div>
          </Link>
        ))}
      </CarouselSlider>
    </section>
  );
};

export default FeaturedPeopleSection;
