import { GenericItemProps } from '@types/common/genericItemProps'
import { MediaType } from '@types/common/MediaType'
import { MovieCard } from '@components/movies/movieCard'
import { TvCard } from '@components/tv/TvCard'
import { TvProps } from '@types/tv/tvProps'
import { MovieProps } from '@types/movies/movieProps'

type GenericListProps = {
  title: String
  genericList: GenericItemProps[]
}
export function GenericList({
  title,
  genericList,
}: GenericListProps): JSX.Element {
  const renderItem = (item: GenericItemProps, i: number) => {
    if (item.media_type === MediaType.Tv) {
      return <TvCard key={i} {...(item as TvProps)} />
    }
    if (item.media_type === MediaType.Movie) {
      return <MovieCard key={i} {...(item as MovieProps)} />
    }
    return null
  }

  return (
    <div className="mb-10">
      <h2 className="h2-guru pb-4 text-center">{title}</h2>
      <ul className="flex flex-wrap items-center justify-between gap-10">
        {genericList.map((item, i) => renderItem(item, i))}
      </ul>
    </div>
  )
}
