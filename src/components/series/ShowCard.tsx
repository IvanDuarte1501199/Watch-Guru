import React, { useState, useEffect } from 'react';
import { ShowCardProps } from 'src/types/shows/ShowCardProps';


export function ShowCard(s: ShowCardProps): JSX.Element {
  const [show, setShow] = useState<any[]>([]);

  useEffect(() => {
      
  }, []);

  return (
    <div>
        {s.title}
    </div>
  );
};