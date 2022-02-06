import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MainContextProvider } from './store/MainContext'
import { BrowserRouter, HashRouter } from 'react-router-dom'
ReactDOM.render(
  <React.StrictMode>
    <MainContextProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </MainContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

