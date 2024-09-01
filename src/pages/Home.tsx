import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-medium-purple hover:bg-lime-zest-light">Welcome to Series Recommendations</h1>
            <Button variant="primary" onClick={() => alert('Button clicked!')}>
                Get Recommendations
            </Button>
            <Link to="/series/1">Ver información de la serie 1</Link>
        </div>
    );
};

export default Home;