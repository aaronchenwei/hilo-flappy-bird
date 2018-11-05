import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import GlobalStyle from './styles/index';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <React.Fragment>
    <App />
    <GlobalStyle />
  </React.Fragment>,
  document.getElementById('root') as HTMLElement
);

// registerServiceWorker();
