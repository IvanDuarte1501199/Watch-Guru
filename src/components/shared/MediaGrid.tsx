import { GenericItemProps } from "@appTypes/common/genericItemProps";
import { Card } from "@components/common/Card";

interface MediaGridProps {
  media: GenericItemProps[];
}

const MediaGrid = ({ media }: MediaGridProps) => {
  if (!media || media.length === 0) return <></>;
  return (
    <span className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6 lg:mb-12'>
      {media.map((media, idx) => (
        <Card key={`${media.id} - ${idx}`} {...media} />
      ))}
    </span>
  );
};

export default MediaGrid;
