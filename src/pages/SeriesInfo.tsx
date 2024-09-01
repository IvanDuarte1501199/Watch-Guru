import React from 'react';
import { useParams } from 'react-router-dom';

const SeriesInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1>Información de la Serie</h1>
            <p>ID de la serie: {id}</p>
        </div>
    );
};

export default SeriesInfo;