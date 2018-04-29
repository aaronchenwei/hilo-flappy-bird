import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import globalStyles from './styles/index';
// import registerServiceWorker from './registerServiceWorker';

const renderApp = () => {
  globalStyles();

  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
};

renderApp();

// registerServiceWorker();
