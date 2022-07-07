import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ContestContextProvider } from './contexts/contest.context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ContestContextProvider>
            <App />
        </ContestContextProvider>
    </React.StrictMode>
);



