import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const FlashMessage = ({type, message}) => (
  <div id="flash-message" className={type} key='flash-msg'>
    <div className="message-text">{message}</div>
  </div>
);

// <div id="flash-message" className={`flash-${type}`} key='flash-msg'>
//   {message}
// </div>

export default FlashMessage;
