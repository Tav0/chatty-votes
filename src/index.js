// main application entry point
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'react-bootstrap/dist/react-bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import './realtime/notifications.js';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
 
import jQuery from 'jquery';    // for toastr;
 
// set global options as desired
toastr.options.closeButton = true;
toastr.options.positionClass = 'toast-bottom-right';
 
window.jQuery = jQuery; // for toastr

import routes from './routes';
import store from './store';

const mountPoint = document.getElementById('root');
const rootnode = (
  <Provider store={store}>
    {routes}
  </Provider>
);

ReactDOM.render(rootnode, mountPoint);
