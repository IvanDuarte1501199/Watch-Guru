import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { InLineTitle } from './InLineTitle';
import { Card } from './Card';
import CarouselSlider from '@components/CarouselSlider';

type GenericListProps = {
  title: string;
  genericList: GenericItemProps[];
  showViewMore?: boolean;
  href?: string;
  customClass?: string;
};
export function GenericList({
  title,
  genericList,
  showViewMore = false,
  href,
  customClass
}: GenericListProps): JSX.Element {
  return (
    <section className={`mb-8 md:mb-16 ${customClass}`}>
      <InLineTitle label={title} showViewMore={showViewMore} href={href} />
      <CarouselSlider maxItems={5}>
        {genericList.map((item: GenericItemProps, i: number) => {
          return <Card key={i} {...item} />;
        })}
      </CarouselSlider>
    </section>
  );
}
