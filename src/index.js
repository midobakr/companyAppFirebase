import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import {createStore , applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from "redux-thunk";
import mainReducer from './App/store/reducers/mainReducer'
import App from './App/App';
import ErrorBoundary from './App/employee/Containers/errorBoundry/errorBoundry';
import './index.css';

const store = createStore(mainReducer , applyMiddleware(thunk))

ReactDOM.render(
  //<React.StrictMode> 
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter> 
          <App/>    
        </BrowserRouter>
      </Provider>
    </ErrorBoundary> 

// </React.StrictMode> 
,
  document.getElementById('root')
);

