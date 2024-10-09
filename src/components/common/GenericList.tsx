import { GenericItemProps } from '@types/common/genericItemProps'
import { InLineTitle } from './InLineTitle'
import { MediaCard } from './Card'
import CarouselSlider from '@components/CarouselSlider'

type GenericListProps = {
  title: string
  genericList: GenericItemProps[]
  mb?: number
}
export function GenericList({
  title,
  genericList,
  mb = 10,
}: GenericListProps): JSX.Element {

  return (
    <section className={`mb-${mb}`}>
      <InLineTitle label={title} showViewMore={false} />
      <CarouselSlider maxItems={5}>
        {genericList.map((item, i: number) => {
          return (
            <MediaCard key={i} item={item} />
          )
        })}
      </CarouselSlider>
    </section>
  )
}
