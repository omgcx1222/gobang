import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import store from "./store"

import App from "./App"
import "./static/base.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
