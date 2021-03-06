import React                    from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

import Header       from '../../components/layout/header/Header.jsx';
import FlashMessage from '../../components/layout/FlashMessage.jsx';

import DevTools     from '../../containers/DevTools.jsx';

import createLayout from './createLayout';


const Layout = createLayout(DevTools);

export default Layout;
