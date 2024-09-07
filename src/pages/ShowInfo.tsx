import React from 'react';
import { useParams } from 'react-router-dom';

const ShowInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1>Información del show</h1>
            <p>ID de la serie: {id}</p>
        </div>
    );
};

export default ShowInfo;