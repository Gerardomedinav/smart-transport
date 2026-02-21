import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import TrackingMap from './Components/TrackingMap';

const rootElement = document.getElementById('app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            {/* 2. LLAMAR AQUÍ AL COMPONENTE */}
            <TrackingMap /> 
        </React.StrictMode>
    );
}