import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import App from './components/app';
// import TestGetItemData from './test-getItemData';

const root = createRoot(document.getElementById('main'));
root.render(<App />);
// root.render(<TestGetItemData />);
