import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { NotificationProvider } from './context/NotificationContext'; 

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const userId = "user123"; // Replace with actual logic

root.render(
  <React.StrictMode>
    <NotificationProvider userId={userId}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </NotificationProvider>
  </React.StrictMode>
);
