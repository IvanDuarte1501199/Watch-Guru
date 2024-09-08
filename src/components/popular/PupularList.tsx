import { PopularItem } from '@types/popular/popularCard';
import { MediaType } from '@types/common/MediaType';
import { MovieCard } from '@components/movies/movieCard';
import { TvCard } from '@components/tv/TvCard';
import { TvProps } from '@types/tv/tvProps';
import { MovieProps } from '@types/movies/movieProps';

type popularListProps = {
  title: String,
  popularList: PopularItem[]
}
export function PopularList({ title, popularList }: popularListProps): JSX.Element {
  const renderItem = (item: PopularItem, i: number) => {
    if (item.media_type === MediaType.Tv) {
      return <TvCard key={i} {...item as TvProps} />;
    }
    if (item.media_type === MediaType.Movie) {
      return <MovieCard key={i} {...item as MovieProps} />;
    }
    return null;
  };

  return (
    <div className='mb-10'>
      <h2 className="h2-guru text-center pb-4">{title}</h2>
      <ul className='flex items-center flex-wrap justify-between gap-10'>
        {popularList.map((item, i) => (
          renderItem(item, i)
        ))}
      </ul>
    </div>
  );
};