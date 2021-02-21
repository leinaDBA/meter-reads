import ReactDOM from 'react-dom';
import React from 'react';
import Main from './main';

const runApp = (): void => {
  ReactDOM.render(React.createElement(Main), document.getElementById('root'));
};

runApp();
