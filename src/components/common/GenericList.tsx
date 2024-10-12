import { GenericItemProps } from '@appTypes/common/genericItemProps'
import { InLineTitle } from './InLineTitle'
import { Card } from './Card'
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
        {genericList.map((item: GenericItemProps, i: number) => {
          return (
            <Card key={i} {...item} />
          )
        })}
      </CarouselSlider>
    </section>
  )
}
