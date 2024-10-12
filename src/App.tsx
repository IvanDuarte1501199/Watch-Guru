import React from 'react';
import AppRouter from './router';
import { Provider } from 'react-redux';
import { store } from './store';

const App: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </div>
    );
};

export default App;
