import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { InLineTitle } from './InLineTitle';
import { Card } from './Card';
import CarouselSlider from '@components/common/CarouselSlider';

type GenericListProps = {
  title: string;
  genericList: GenericItemProps[];
  showViewMore?: boolean;
  href?: string;
  customClass?: string;
  viewMoreText?: string
};
export function GenericList({
  title,
  genericList,
  showViewMore = false,
  href,
  customClass,
  viewMoreText
}: GenericListProps): JSX.Element {
  return (
    <section className={`mb-8 md:mb-16 ${customClass}`}>
      <InLineTitle label={title} showViewMore={showViewMore} href={href} viewMoreText={viewMoreText} />
      <CarouselSlider maxItems={5} slideItems={4}>
        {genericList.map((item: GenericItemProps, i: number) => {
          return <Card key={`item-${item.media_type}-${item.id}`} {...item} />;
        })}
      </CarouselSlider>
    </section>
  );
}
