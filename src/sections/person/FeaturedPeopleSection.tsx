import React from 'react';
import { PersonProps } from '@appTypes/person/personProps';
import { Link } from 'react-router-dom';
import CarouselSlider from '@components/CarouselSlider';

interface FeaturedPeopleSectionProps {
  people: FeaturedPersonProps[];
  customClass?: string;
}

type FeaturedPersonProps = Pick<PersonProps, 'id' | 'name' | 'profile_path' | 'known_for_department'>;

const FeaturedPeopleSection: React.FC<FeaturedPeopleSectionProps> = ({ people, customClass }) => {
  return (
    <section className={`mb-12 md:mb-16 ${customClass}`}>
      <CarouselSlider maxItems={5} slideItems={5} mobileMaxItems={2}
        mobileSlideItems={2}>
        {people.map((person) => (
          <Link to={`/person/${person.id}`} key={person.id}>
            <div className="bg-gray-800 rounded-lg shadow-lg transition-transform ">
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                alt={person.name}
                className="rounded-lg mb-2"
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
