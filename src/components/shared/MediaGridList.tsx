import Button from '@components/common/Button';
import MediaGrid from './MediaGrid';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { useState } from 'react';

interface MediaGridListProps {
  media: GenericItemProps[];
  label?: string;
}

const MediaGridList = ({ media, label }: MediaGridListProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayMedia = showAll ? media : media.slice(0, 10);

  return (
    <>
      {label && <h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>{label}</h2>}
      <MediaGrid media={displayMedia} />
      {media.length > 10 && !showAll && (
        <Button onClick={() => setShowAll(true)} variant="secondary">
          View more
        </Button>
      )}
    </>
  );
};
export default MediaGridList;
