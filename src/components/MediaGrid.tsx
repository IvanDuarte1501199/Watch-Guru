import { GenericItemProps } from "@appTypes/common/genericItemProps";
import { Card } from "./common/Card";

interface MediaGridProps {
  media: GenericItemProps[]
}

const MediaGrid = ({ media }: MediaGridProps) => {

  return (
    <span className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
      {media.map((media) => (
        <Card key={media.id} {...media} />
      ))}
    </span>
  );
};

export default MediaGrid;
